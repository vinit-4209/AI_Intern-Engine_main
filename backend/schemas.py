"""
Pydantic schemas for request/response validation
These define the structure of data sent to and from the API
"""
from pydantic import BaseModel, ConfigDict, EmailStr
# from pydantic import BaseModel, EmailStr
from typing import Optional, List, Literal
from datetime import datetime


# Student Schemas
class StudentCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    qualification: str
    skills: str  # Comma-separated
    location: str
    preferred_sectors: str  # Comma-separated
    social_category: str
    is_rural: bool = False
    is_aspirational_district: bool = False
    past_participation: bool = False


class StudentResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    qualification: str
    skills: str
    location: str
    preferred_sectors: str
    social_category: str
    is_rural: bool
    is_aspirational_district: bool
    past_participation: bool
    resume_filename: Optional[str] = None
    resume_skills: Optional[str] = None
    resume_summary: Optional[str] = None
    resume_sector_insights: Optional[str] = None
    created_at: datetime

    # class Config:
    #     from_attributes = True
    model_config = ConfigDict(from_attributes=True)

# Company Schemas
class CompanyCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    industry: str
    location: str


class CompanyResponse(BaseModel):
    id: int
    name: str
    email: str
    industry: str
    location: str
    created_at: datetime

    class Config:
        from_attributes = True


# Internship Schemas
class InternshipCreate(BaseModel):
    title: str
    description: str
    required_skills: str  # Comma-separated
    location: str
    sector: str
    duration_months: int
    stipend: float
    capacity: int
    qualification_required: str


class InternshipResponse(BaseModel):
    id: int
    company_id: int
    company_name: str
    title: str
    description: str
    required_skills: str
    location: str
    sector: str
    duration_months: int
    stipend: float
    capacity: int
    qualification_required: str
    created_at: datetime

    class Config:
        from_attributes = True


# Application Schemas
class ApplicationCreate(BaseModel):
    student_id: int
    internship_id: int
    cover_letter: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    internship_id: int
    status: str
    cover_letter: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApplicationSummary(BaseModel):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApplicationStudentInfo(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    qualification: Optional[str] = None
    skills: Optional[str] = None
    location: Optional[str] = None
    resume_skills: Optional[str] = None

    class Config:
        from_attributes = True


class ApplicationInternshipInfo(BaseModel):
    id: int
    title: str
    sector: Optional[str] = None
    location: Optional[str] = None
    company_name: Optional[str] = None

    class Config:
        from_attributes = True


class CompanyApplicationResponse(BaseModel):
    id: int
    status: str
    cover_letter: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    internship: ApplicationInternshipInfo
    student: ApplicationStudentInfo

    class Config:
        from_attributes = True


# Match Schemas
class MatchResponse(BaseModel):
    id: int
    student_id: int
    internship_id: int
    match_score: float
    skill_score: float
    location_score: float
    sector_score: float
    qualification_score: float
    affirmative_bonus: float
    internship: Optional[InternshipResponse] = None
    status: Optional[str] = "new"
    feedback: Optional[str] = None
    status_updated_at: Optional[datetime] = None
    application: Optional[ApplicationSummary] = None

    class Config:
        from_attributes = True


class CandidateStudentSummary(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    qualification: Optional[str] = None
    skills: Optional[str] = None
    location: Optional[str] = None
    resume_summary: Optional[str] = None
    resume_skills: Optional[str] = None
    experience_level: str
    past_participation: Optional[bool] = None

    class Config:
        from_attributes = True


class CandidateMatchResponse(BaseModel):
    match_id: int
    match_score: float
    skill_score: float
    location_score: float
    sector_score: float
    qualification_score: float
    affirmative_bonus: float
    status: str
    feedback: Optional[str] = None
    status_updated_at: Optional[datetime] = None
    generated_at: datetime
    internship: InternshipResponse
    student: CandidateStudentSummary
    application: Optional[ApplicationSummary] = None

    class Config:
        from_attributes = True


class MatchStatusUpdate(BaseModel):
    status: Optional[Literal["new", "shortlisted", "contacted", "hired", "rejected"]] = None
    feedback: Optional[str] = None


# Login Schemas
class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    message: str
    user_type: str
    user_id: int
    name: str


class PasswordResetRequest(BaseModel):
    email: EmailStr
    new_password: str
