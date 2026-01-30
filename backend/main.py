"""FastAPI main application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Admin, get_db, init_db
from utils.security import hash_password
from api import admin, applications, companies, internships, matches, students

app = FastAPI(
    title="PM Internship Allocation System",
    description="AI-based smart allocation engine for matching students with internships",
    version="1.0.0",
)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for internship/demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event() -> None:
    """Initialise the database and ensure the default admin exists."""

    init_db()
    db = next(get_db())
    admin_user = db.query(Admin).filter(Admin.username == "admin").first()
    if not admin_user:
        admin_user = Admin(username="admin", password=hash_password("admin123"))
        db.add(admin_user)
        db.commit()
    db.close()


def include_routers(application: FastAPI) -> None:
    """Register all API routers with the FastAPI application."""

    application.include_router(students.router)
    application.include_router(companies.router)
    application.include_router(internships.router)
    application.include_router(applications.router)
    application.include_router(matches.router)
    application.include_router(admin.router)


include_routers(app)


@app.get("/")
def root() -> dict[str, str]:
    return {
        "message": "PM Internship Allocation System API",
        "version": "1.0.0",
        "docs": "/docs",
    }


import os
import uvicorn

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)