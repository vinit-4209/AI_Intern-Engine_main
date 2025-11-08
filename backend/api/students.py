"""Student related API routes."""

from __future__ import annotations

from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from pydantic import EmailStr
from sqlalchemy.orm import Session

from database import Student, get_db
from resume_parser import (
    analyse_resume_text,
    build_resume_summary,
    extract_text_from_resume,
    merge_comma_separated,
)
from schemas import (
    LoginRequest,
    LoginResponse,
    PasswordResetRequest,
    StudentResponse,
)
from utils.security import hash_password

router = APIRouter(prefix="/api/students", tags=["students"])


def get_resume_storage_path(student_id: int, filename: str) -> Path:
    """Return the expected storage path for a student's resume."""

    return Path("storage/resumes") / str(student_id) / filename


async def _parse_resume(resume: UploadFile | None) -> tuple[str | None, str | None, List[str], List[str], str | None]:
    """Extract information from an uploaded resume file."""

    if not resume or not resume.filename:
        return None, None, [], [], None

    try:
        file_bytes = await resume.read()
        resume_filename = Path(resume.filename).name
        resume_text = extract_text_from_resume(file_bytes, resume_filename)
        analysis = analyse_resume_text(resume_text)
        resume_skills = analysis.get("skills", [])
        resume_sector_insights = analysis.get("sectors", [])
        resume_summary = build_resume_summary(resume_skills, resume_sector_insights)
        return resume_filename, resume_text, resume_skills, resume_sector_insights, resume_summary
    except Exception:  # pragma: no cover - defensive
        raise HTTPException(
            status_code=400,
            detail="Failed to process resume. Please upload a valid PDF, DOCX or TXT file.",
        ) from None
    finally:
        if resume:
            await resume.close()


@router.post("/register", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def register_student(
    name: str = Form(...),
    email: EmailStr = Form(...),
    password: str = Form(...),
    phone: str = Form(...),
    qualification: str = Form(...),
    skills: str = Form(...),
    location: str = Form(...),
    preferred_sectors: str = Form(...),
    social_category: str = Form(...),
    is_rural: bool = Form(False),
    is_aspirational_district: bool = Form(False),
    past_participation: bool = Form(False),
    resume: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    """Register a new student."""

    existing = db.query(Student).filter(Student.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    (
        resume_filename,
        resume_text,
        resume_skills,
        resume_sector_insights,
        resume_summary,
    ) = await _parse_resume(resume)

    combined_skills = merge_comma_separated(skills, resume_skills)
    combined_sectors = merge_comma_separated(preferred_sectors, resume_sector_insights)

    db_student = Student(
        name=name,
        email=email,
        password=hash_password(password),
        phone=phone,
        qualification=qualification,
        skills=combined_skills,
        location=location,
        preferred_sectors=combined_sectors,
        social_category=social_category,
        is_rural=is_rural,
        is_aspirational_district=is_aspirational_district,
        past_participation=past_participation,
        resume_filename=resume_filename,
        resume_text=resume_text[:20000] if resume_text else None,
        resume_skills=", ".join(resume_skills) if resume_skills else None,
        resume_summary=resume_summary,
        resume_sector_insights=", ".join(resume_sector_insights) if resume_sector_insights else None,
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student


@router.put("/{student_id}", response_model=StudentResponse)
async def update_student_profile(
    student_id: int,
    name: str = Form(...),
    phone: str = Form(...),
    qualification: str = Form(...),
    skills: str = Form(...),
    location: str = Form(...),
    preferred_sectors: str = Form(...),
    social_category: str = Form(...),
    is_rural: bool = Form(False),
    is_aspirational_district: bool = Form(False),
    past_participation: bool = Form(False),
    resume: UploadFile | None = File(None),
    password: str | None = Form(None),
    db: Session = Depends(get_db),
):
    """Update an existing student's profile information."""

    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    resume_filename = student.resume_filename
    resume_text = student.resume_text
    resume_summary = student.resume_summary
    stored_resume_skills = [item.strip() for item in (student.resume_skills or "").split(",") if item.strip()]
    stored_sector_insights = [
        item.strip() for item in (student.resume_sector_insights or "").split(",") if item.strip()
    ]

    resume_skills: List[str] = stored_resume_skills
    resume_sector_insights: List[str] = stored_sector_insights

    if resume and resume.filename:
        (
            resume_filename,
            resume_text,
            resume_skills,
            resume_sector_insights,
            resume_summary,
        ) = await _parse_resume(resume)

    combined_skills = merge_comma_separated(skills, resume_skills)
    combined_sectors = merge_comma_separated(preferred_sectors, resume_sector_insights)

    student.name = name
    student.phone = phone
    student.qualification = qualification
    student.skills = combined_skills
    student.location = location
    student.preferred_sectors = combined_sectors
    student.social_category = social_category
    student.is_rural = is_rural
    student.is_aspirational_district = is_aspirational_district
    student.past_participation = past_participation
    student.resume_filename = resume_filename
    student.resume_text = resume_text[:20000] if resume_text else None
    student.resume_skills = ", ".join(resume_skills) if resume_skills else None
    student.resume_summary = resume_summary
    student.resume_sector_insights = (
        ", ".join(resume_sector_insights) if resume_sector_insights else None
    )

    if password:
        student.password = hash_password(password)

    db.commit()
    db.refresh(student)
    return student


@router.post("/login", response_model=LoginResponse)
def login_student(login: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a student user."""

    student = db.query(Student).filter(Student.email == login.email).first()
    if not student or student.password != hash_password(login.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return LoginResponse(
        message="Login successful",
        user_type="student",
        user_id=student.id,
        name=student.name,
    )


@router.post("/reset-password")
def reset_student_password(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    """Allow students to reset their password using email."""

    student = db.query(Student).filter(Student.email == payload.email).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):
    """Return details for a specific student."""

    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@router.get("/{student_id}/resume")
def download_student_resume(student_id: int, db: Session = Depends(get_db)):
    """Download the stored resume for a student."""

    student = db.query(Student).filter(Student.id == student_id).first()
    if not student or not student.resume_filename:
        raise HTTPException(status_code=404, detail="Resume not found")

    file_path = get_resume_storage_path(student_id, student.resume_filename)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Resume not found")

    return FileResponse(file_path, filename=student.resume_filename, media_type="application/octet-stream")


@router.get("", response_model=List[StudentResponse])
def get_all_students(db: Session = Depends(get_db)):
    """Return all registered students."""

    return db.query(Student).all()
