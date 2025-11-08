"""Application related API routes."""

from datetime import datetime
from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from database import Application, Internship, Match, Student, get_db
from schemas import ApplicationCreate, ApplicationResponse, CompanyApplicationResponse

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(application: ApplicationCreate, db: Session = Depends(get_db)):
    """Submit an application for a specific internship."""

    student = db.query(Student).filter(Student.id == application.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    internship = db.query(Internship).filter(Internship.id == application.internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    existing_application = (
        db.query(Application)
        .filter(
            Application.student_id == application.student_id,
            Application.internship_id == application.internship_id,
        )
        .first()
    )

    normalized_cover_letter = application.cover_letter.strip() if application.cover_letter else None

    if existing_application:
        if normalized_cover_letter is not None:
            existing_application.cover_letter = normalized_cover_letter
            existing_application.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(existing_application)
        return existing_application

    db_application = Application(
        student_id=application.student_id,
        internship_id=application.internship_id,
        cover_letter=normalized_cover_letter,
        status="pending",
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, db: Session = Depends(get_db)):
    """Allow a student to withdraw an application."""

    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    student_id = application.student_id
    internship_id = application.internship_id

    db.delete(application)

    match = (
        db.query(Match)
        .filter(Match.student_id == student_id, Match.internship_id == internship_id)
        .first()
    )
    if match:
        match.status = "new"
        match.feedback = None
        match.status_updated_at = datetime.utcnow()

    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/student/{student_id}", response_model=List[ApplicationResponse])
def get_student_applications(student_id: int, db: Session = Depends(get_db)):
    """Fetch all applications submitted by a student."""

    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return (
        db.query(Application)
        .filter(Application.student_id == student_id)
        .order_by(Application.created_at.desc())
        .all()
    )


@router.get("/company/{company_id}", response_model=List[CompanyApplicationResponse])
def get_company_applications(company_id: int, db: Session = Depends(get_db)):
    """Return all student applications for internships owned by a company."""

    internships = db.query(Internship).filter(Internship.company_id == company_id).all()
    if not internships:
        return []

    internship_map = {internship.id: internship for internship in internships}
    internship_ids = list(internship_map.keys())

    applications = (
        db.query(Application)
        .filter(Application.internship_id.in_(internship_ids))
        .order_by(Application.created_at.desc())
        .all()
    )

    if not applications:
        return []

    student_ids = {application.student_id for application in applications}
    students = db.query(Student).filter(Student.id.in_(student_ids)).all()
    student_map = {student.id: student for student in students}

    response: List[Dict[str, object]] = []

    for application in applications:
        internship = internship_map.get(application.internship_id)
        student = student_map.get(application.student_id)

        if not internship or not student:
            continue

        response.append(
            {
                "id": application.id,
                "status": application.status,
                "cover_letter": application.cover_letter,
                "created_at": application.created_at,
                "updated_at": application.updated_at,
                "internship": internship,
                "student": student,
            }
        )

    return response
