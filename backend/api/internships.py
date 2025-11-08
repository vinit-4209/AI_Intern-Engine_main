"""Internship related API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import Company, Internship, Match, get_db
from schemas import InternshipCreate, InternshipResponse

router = APIRouter(prefix="/api/internships", tags=["internships"])


@router.post("", response_model=InternshipResponse, status_code=status.HTTP_201_CREATED)
def create_internship(
    internship: InternshipCreate,
    company_id: int,
    db: Session = Depends(get_db),
):
    """Create a new internship posting."""

    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    db_internship = Internship(
        **internship.dict(),
        company_id=company_id,
        company_name=company.name,
    )
    db.add(db_internship)
    db.commit()
    db.refresh(db_internship)
    return db_internship


@router.get("", response_model=list[InternshipResponse])
def get_all_internships(db: Session = Depends(get_db)):
    """Return all internships."""

    return db.query(Internship).all()


@router.get("/company/{company_id}", response_model=list[InternshipResponse])
def get_company_internships(company_id: int, db: Session = Depends(get_db)):
    """Return all internships posted by a specific company."""

    return db.query(Internship).filter(Internship.company_id == company_id).all()


@router.delete("/{internship_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_internship(internship_id: int, db: Session = Depends(get_db)):
    """Delete an internship (admin/company only)."""

    internship = db.query(Internship).filter(Internship.id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")

    db.query(Match).filter(Match.internship_id == internship_id).delete()
    db.delete(internship)
    db.commit()
    return None
