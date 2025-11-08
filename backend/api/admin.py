"""Admin related API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import Admin as AdminModel
from database import Company, Internship, Match, Student, get_db
from utils.security import hash_password

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login")
def admin_login(username: str, password: str, db: Session = Depends(get_db)):
    """Authenticate the admin user."""

    admin = db.query(AdminModel).filter(AdminModel.username == username).first()
    if not admin or admin.password != hash_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful", "user_type": "admin", "user_id": admin.id}


@router.delete("/students/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    """Delete a student (admin only)."""

    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.query(Match).filter(Match.student_id == student_id).delete()
    db.delete(student)
    db.commit()
    return None


@router.delete("/companies/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: int, db: Session = Depends(get_db)):
    """Delete a company (admin only)."""

    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    internships = db.query(Internship).filter(Internship.company_id == company_id).all()
    for internship in internships:
        db.query(Match).filter(Match.internship_id == internship.id).delete()
        db.delete(internship)

    db.delete(company)
    db.commit()
    return None


@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    """Get system statistics for the admin dashboard."""

    total_students = db.query(Student).count()
    total_companies = db.query(Company).count()
    total_internships = db.query(Internship).count()
    total_matches = db.query(Match).count()

    return {
        "total_students": total_students,
        "total_companies": total_companies,
        "total_internships": total_internships,
        "total_matches": total_matches,
    }
