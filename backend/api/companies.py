"""Company related API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import Company, get_db
from schemas import CompanyCreate, CompanyResponse, LoginRequest, LoginResponse, PasswordResetRequest
from utils.security import hash_password

router = APIRouter(prefix="/api/companies", tags=["companies"])


@router.post("/register", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def register_company(company: CompanyCreate, db: Session = Depends(get_db)):
    """Register a new company."""

    existing = db.query(Company).filter(Company.email == company.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    db_company = Company(
        **company.dict(exclude={"password"}),
        password=hash_password(company.password),
    )
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company


@router.post("/login", response_model=LoginResponse)
def login_company(login: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a company user."""

    company = db.query(Company).filter(Company.email == login.email).first()
    if not company or company.password != hash_password(login.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return LoginResponse(
        message="Login successful",
        user_type="company",
        user_id=company.id,
        name=company.name,
    )


@router.post("/reset-password")
def reset_company_password(payload: PasswordResetRequest, db: Session = Depends(get_db)):
    """Allow companies to reset their password using email."""

    company = db.query(Company).filter(Company.email == payload.email).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    company.password = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.get("", response_model=list[CompanyResponse])
def get_all_companies(db: Session = Depends(get_db)):
    """Return all registered companies."""

    return db.query(Company).all()
