"""
Database configuration and models using SQLAlchemy
This file sets up the SQLite database and defines all data models
"""

from typing import Optional

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Boolean,
    Text,
    inspect,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# SQLite database URL (creates a file named 'internship.db')
DATABASE_URL = "sqlite:///./internship.db"

# Create database engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


# Student Model
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    phone = Column(String)
    qualification = Column(String)  # e.g., "B.Tech", "MBA"
    skills = Column(Text)  # Comma-separated skills
    location = Column(String)
    preferred_sectors = Column(Text)  # Comma-separated sectors
    social_category = Column(String)  # e.g., "General", "OBC", "SC", "ST"
    is_rural = Column(Boolean, default=False)
    is_aspirational_district = Column(Boolean, default=False)
    past_participation = Column(Boolean, default=False)
    resume_filename = Column(String, nullable=True)
    resume_text = Column(Text, nullable=True)
    resume_skills = Column(Text, nullable=True)
    resume_summary = Column(Text, nullable=True)
    resume_sector_insights = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


# Company Model
class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    industry = Column(String)
    location = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


# Internship Model
class Internship(Base):
    __tablename__ = "internships"
    
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, nullable=False)
    company_name = Column(String)
    title = Column(String, nullable=False)
    description = Column(Text)
    required_skills = Column(Text)  # Comma-separated skills
    location = Column(String)
    sector = Column(String)
    duration_months = Column(Integer)
    stipend = Column(Float)
    capacity = Column(Integer)  # Number of positions
    qualification_required = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


# Match Model (stores AI-generated matches)
class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    internship_id = Column(Integer, nullable=False)
    match_score = Column(Float)  # 0-100 score
    skill_score = Column(Float)
    location_score = Column(Float)
    sector_score = Column(Float)
    qualification_score = Column(Float)
    affirmative_bonus = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="new")
    status_updated_at = Column(DateTime, default=datetime.utcnow)
    feedback = Column(Text, nullable=True)


# Application Model
class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False, index=True)
    internship_id = Column(Integer, nullable=False, index=True)
    status = Column(String, default="pending")
    cover_letter = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


# Admin Model
class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)

    # Lightweight schema migrations for new resume-related columns.
    with engine.begin() as conn:
        inspector = inspect(conn)
        student_columns = {col["name"] for col in inspector.get_columns("students")}

        def add_student_column_if_missing(column_name: str, ddl: str) -> None:
            if column_name not in student_columns:
                conn.exec_driver_sql(f"ALTER TABLE students ADD COLUMN {ddl}")
                student_columns.add(column_name)

        add_student_column_if_missing("resume_filename", "resume_filename TEXT")
        add_student_column_if_missing("resume_text", "resume_text TEXT")
        add_student_column_if_missing("resume_skills", "resume_skills TEXT")
        add_student_column_if_missing("resume_summary", "resume_summary TEXT")
        add_student_column_if_missing("resume_sector_insights", "resume_sector_insights TEXT")

        match_columns = {col["name"] for col in inspector.get_columns("matches")}

        def add_match_column_if_missing(column_name: str, ddl: str, post_sql: Optional[str] = None) -> None:
            if column_name not in match_columns:
                conn.exec_driver_sql(f"ALTER TABLE matches ADD COLUMN {ddl}")
                match_columns.add(column_name)
                if post_sql:
                    conn.exec_driver_sql(post_sql)

        add_match_column_if_missing("status", "status TEXT DEFAULT 'new'", "UPDATE matches SET status = 'new' WHERE status IS NULL")
        add_match_column_if_missing("status_updated_at", "status_updated_at DATETIME", "UPDATE matches SET status_updated_at = COALESCE(status_updated_at, created_at)")
        add_match_column_if_missing("feedback", "feedback TEXT")


# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
