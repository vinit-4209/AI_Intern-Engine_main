"""AI matching related API routes."""

from datetime import datetime
from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import Application, Internship, Match, Student, get_db
from ml_engine import InternshipMatchingEngine
from schemas import (
    CandidateMatchResponse,
    MatchResponse,
    MatchStatusUpdate,
)

router = APIRouter(prefix="/api", tags=["matches"])
ml_engine = InternshipMatchingEngine()


@router.post("/matches/generate/{student_id}")
def generate_matches(student_id: int, db: Session = Depends(get_db)):
    """Generate AI-based matches for a student."""

    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    internships = db.query(Internship).all()
    if not internships:
        return {"message": "No internships available"}

    student_dict = {
        "id": student.id,
        "skills": student.skills,
        "resume_skills": student.resume_skills or "",
        "location": student.location,
        "preferred_sectors": student.preferred_sectors,
        "resume_sector_insights": student.resume_sector_insights or "",
        "qualification": student.qualification,
        "is_rural": student.is_rural,
        "is_aspirational_district": student.is_aspirational_district,
        "social_category": student.social_category,
        "past_participation": student.past_participation,
    }

    feedback_records = []
    historical_matches = db.query(Match).all()
    for record in historical_matches:
        feedback_records.append(
            {
                "status": record.status,
                "feedback": record.feedback,
                "skill_score": record.skill_score or 0.0,
                "location_score": record.location_score or 0.0,
                "sector_score": record.sector_score or 0.0,
                "qualification_score": record.qualification_score or 0.0,
                "affirmative_bonus": record.affirmative_bonus or 0.0,
            }
        )

    internships_dict = [
        {
            "id": internship.id,
            "required_skills": internship.required_skills,
            "location": internship.location,
            "sector": internship.sector,
            "qualification_required": internship.qualification_required,
        }
        for internship in internships
    ]

    matches = ml_engine.find_best_matches(
        student_dict,
        internships_dict,
        feedback_records=feedback_records,
        top_n=10,
    )

    db.query(Match).filter(Match.student_id == student_id).delete()

    for match in matches:
        db_match = Match(
            student_id=student_id,
            internship_id=match["internship_id"],
            match_score=match["match_score"],
            skill_score=match["skill_score"],
            location_score=match["location_score"],
            sector_score=match["sector_score"],
            qualification_score=match["qualification_score"],
            affirmative_bonus=match["affirmative_bonus"],
            status="new",
            status_updated_at=datetime.utcnow(),
        )
        db.add(db_match)

    db.commit()
    return {
        "message": f"Generated {len(matches)} matches",
        "count": len(matches),
        "weights": ml_engine.current_weights,
    }


@router.get("/matches/student/{student_id}", response_model=List[MatchResponse])
def get_student_matches(student_id: int, db: Session = Depends(get_db)):
    """Get all matches for a student with internship details."""

    matches = db.query(Match).filter(Match.student_id == student_id).all()

    internship_ids = [match.internship_id for match in matches]
    internships = (
        db.query(Internship)
        .filter(Internship.id.in_(internship_ids))
        .all()
        if internship_ids
        else []
    )
    internship_map = {internship.id: internship for internship in internships}

    applications = (
        db.query(Application)
        .filter(
            Application.student_id == student_id,
            Application.internship_id.in_(internship_ids),
        )
        .all()
        if internship_ids
        else []
    )
    application_map = {application.internship_id: application for application in applications}

    result = []
    for match in matches:
        internship = internship_map.get(match.internship_id)
        match_dict = {
            "id": match.id,
            "student_id": match.student_id,
            "internship_id": match.internship_id,
            "match_score": match.match_score,
            "skill_score": match.skill_score,
            "location_score": match.location_score,
            "sector_score": match.sector_score,
            "qualification_score": match.qualification_score,
            "affirmative_bonus": match.affirmative_bonus,
            "internship": internship,
            "status": match.status or "new",
            "feedback": match.feedback,
            "status_updated_at": match.status_updated_at,
        }
        application = application_map.get(match.internship_id)
        if application:
            match_dict["application"] = application
        result.append(match_dict)

    return result


@router.get("/company/{company_id}/candidates", response_model=List[CandidateMatchResponse])
def get_company_candidate_matches(company_id: int, db: Session = Depends(get_db)):
    """Return AI-ranked candidate matches for all internships owned by a company."""

    internships = db.query(Internship).filter(Internship.company_id == company_id).all()
    if not internships:
        return []

    internship_map = {internship.id: internship for internship in internships}
    internship_ids = list(internship_map.keys())

    matches = (
        db.query(Match)
        .filter(Match.internship_id.in_(internship_ids))
        .order_by(Match.match_score.desc())
        .all()
    )

    applications = db.query(Application).filter(Application.internship_id.in_(internship_ids)).all()
    application_map: Dict[tuple[int, int], Application] = {
        (application.student_id, application.internship_id): application
        for application in applications
    }

    student_cache: Dict[int, Student] = {}
    response: List[Dict[str, object]] = []

    for match in matches:
        student = student_cache.get(match.student_id)
        if student is None:
            student = db.query(Student).filter(Student.id == match.student_id).first()
            if student is None:
                continue
            student_cache[match.student_id] = student

        internship = internship_map.get(match.internship_id)
        if internship is None:
            continue

        application = application_map.get((match.student_id, match.internship_id))
        if application is None:
            continue

        experience_level = "experienced" if student.past_participation else "fresher"

        response.append(
            {
                "match_id": match.id,
                "match_score": match.match_score,
                "skill_score": match.skill_score,
                "location_score": match.location_score,
                "sector_score": match.sector_score,
                "qualification_score": match.qualification_score,
                "affirmative_bonus": match.affirmative_bonus,
                "status": match.status or "new",
                "feedback": match.feedback,
                "status_updated_at": match.status_updated_at,
                "generated_at": match.created_at,
                "internship": internship,
                "student": {
                    "id": student.id,
                    "name": student.name,
                    "email": student.email,
                    "phone": student.phone,
                    "qualification": student.qualification,
                    "skills": student.skills,
                    "location": student.location,
                    "resume_summary": student.resume_summary,
                    "resume_skills": student.resume_skills,
                    "experience_level": experience_level,
                    "past_participation": student.past_participation,
                },
                "application": application,
            }
        )

    return response


@router.patch("/matches/{match_id}/status", response_model=MatchResponse)
def update_match_status(match_id: int, payload: MatchStatusUpdate, db: Session = Depends(get_db)):
    """Allow companies to update candidate pipeline status or provide feedback."""

    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    updated = False

    if payload.status is not None:
        match.status = payload.status
        match.status_updated_at = datetime.utcnow()
        updated = True

    if payload.feedback is not None:
        cleaned_feedback = payload.feedback.strip()
        match.feedback = cleaned_feedback if cleaned_feedback else None
        match.status_updated_at = datetime.utcnow()
        updated = True

    if not updated:
        raise HTTPException(status_code=400, detail="No updates provided")

    application = (
        db.query(Application)
        .filter(
            Application.student_id == match.student_id,
            Application.internship_id == match.internship_id,
        )
        .first()
    )

    if application and payload.status is not None:
        application.status = payload.status
        application.updated_at = datetime.utcnow()
        db.add(application)

    db.commit()
    db.refresh(match)
    if application:
        db.refresh(application)

    internship = db.query(Internship).filter(Internship.id == match.internship_id).first()

    return {
        "id": match.id,
        "student_id": match.student_id,
        "internship_id": match.internship_id,
        "match_score": match.match_score,
        "skill_score": match.skill_score,
        "location_score": match.location_score,
        "sector_score": match.sector_score,
        "qualification_score": match.qualification_score,
        "affirmative_bonus": match.affirmative_bonus,
        "internship": internship,
        "status": match.status or "new",
        "feedback": match.feedback,
        "status_updated_at": match.status_updated_at,
        "application": application,
    }
