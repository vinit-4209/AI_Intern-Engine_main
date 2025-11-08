"""
Seed script for inserting dummy data into Students, Companies, and Internships tables
Compatible with database.py structure — includes varied skill data
"""

from datetime import datetime
import random
from database import SessionLocal, init_db, Student, Company, Internship


def seed_data():
    db = SessionLocal()
    init_db()

    # ----------------------------
    # 1️⃣ Seed Companies
    # ----------------------------
    companies_data = [
        {
            "name": "TechWave Solutions",
            "email": "contact@techwave.com",
            "password": "company123",
            "industry": "Information Technology",
            "location": "Bangalore",
        },
        {
            "name": "Finlytix",
            "email": "info@finlytix.com",
            "password": "company123",
            "industry": "Finance",
            "location": "Mumbai",
        },
        {
            "name": "EduSmart Labs",
            "email": "hello@edusmart.com",
            "password": "company123",
            "industry": "Education",
            "location": "Delhi",
        },
        {
            "name": "HealthBridge",
            "email": "hr@healthbridge.com",
            "password": "company123",
            "industry": "Healthcare",
            "location": "Chennai",
        },
        {
            "name": "AIgenix",
            "email": "careers@aigenix.com",
            "password": "company123",
            "industry": "Artificial Intelligence",
            "location": "Hyderabad",
        },
    ]

    companies = []
    for c in companies_data:
        company = Company(**c)
        db.add(company)
        companies.append(company)

    db.commit()
    print("✅ Companies seeded successfully.")

    # ----------------------------
    # 2️⃣ Seed Students (with unique Indian names & skills)
    # ----------------------------
    indian_names = [
        "Aarav Sharma", "Priya Verma", "Rohan Patel", "Ananya Singh",
        "Vikram Nair", "Neha Gupta", "Arjun Reddy", "Sneha Das",
        "Rahul Mehta", "Ishita Iyer"
    ]

    qualifications = ["B.Tech", "BCA", "MCA", "MBA", "B.Sc"]
    sectors = ["IT", "Data Science", "Finance", "Marketing"]
    categories = ["General", "OBC", "SC", "ST"]
    locations = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Pune"]

    # Varied skill pool
    skill_pool = [
        "Python", "C++", "Java", "SQL", "Excel", "Machine Learning",
        "Data Visualization", "HTML", "CSS", "JavaScript", "Django",
        "Communication", "Leadership", "Power BI", "Tableau", "Deep Learning"
    ]

    for i, name in enumerate(indian_names):
        student_skills = ", ".join(random.sample(skill_pool, random.randint(4, 6)))
        student = Student(
            name=name,
            email=f"{name.split()[0].lower()}{i+1}@mail.com",
            password="student123",
            phone=f"98765432{i:02d}",
            qualification=random.choice(qualifications),
            skills=student_skills,
            location=random.choice(locations),
            preferred_sectors=",".join(random.sample(sectors, 2)),
            social_category=random.choice(categories),
            is_rural=random.choice([True, False]),
            is_aspirational_district=random.choice([True, False]),
            past_participation=random.choice([True, False]),
        )
        db.add(student)

    db.commit()
    print("✅ Students seeded successfully with varied skills.")

    # ----------------------------
    # 3️⃣ Seed Internships (unique skills per role)
    # ----------------------------
    internship_data = [
        ("Data Science Intern", ["Python", "Pandas", "Machine Learning", "Data Visualization"]),
        ("Software Development Intern", ["C++", "Java", "SQL", "Git", "Problem Solving"]),
        ("AI Research Intern", ["Python", "Deep Learning", "TensorFlow", "NLP"]),
        ("Business Analyst Intern", ["Excel", "Power BI", "Communication", "Critical Thinking"]),
        ("Web Development Intern", ["HTML", "CSS", "JavaScript", "React", "Node.js"]),
    ]

    for company in companies:
        for i in range(2):  # Each company gets 2 internships
            title, skills = random.choice(internship_data)
            internship = Internship(
                company_id=company.id,
                company_name=company.name,
                title=title,
                description=f"Join {company.name} as a {title} and work on cutting-edge projects.",
                required_skills=", ".join(skills),
                location=company.location,
                sector=company.industry,
                duration_months=random.randint(1, 6),
                stipend=round(random.uniform(5000, 15000), 2),
                capacity=random.randint(1, 5),
                qualification_required=random.choice(qualifications),
            )
            db.add(internship)

    db.commit()
    print("✅ Internships seeded successfully with unique required skills.")

    db.close()
    print("🎉 All dummy data (Students, Companies, Internships) seeded successfully!")


if __name__ == "__main__":
    seed_data()
