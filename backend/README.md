# Backend API Documentation

## Overview
FastAPI-based REST API for the PM Internship Allocation System with AI/ML matching engine.

## Tech Stack
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **SQLite**: Lightweight database
- **Scikit-learn**: ML library for matching algorithm
- **Pandas & NumPy**: Data processing

## Setup Instructions

### 1. Install Python 3.10+
Make sure Python 3.10 or higher is installed on your system.

### 2. Create Virtual Environment (Recommended)
\`\`\`bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On Mac/Linux
source venv/bin/activate
\`\`\`

### 3. Install Dependencies
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### 4. Run the Server
\`\`\`bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

Or use the provided script:
\`\`\`bash
chmod +x run.sh
./run.sh
\`\`\`

### 5. Access API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Database
- **Type**: SQLite (file-based, no installation needed)
- **File**: `internship.db` (auto-created on first run)
- **Tables**: students, companies, internships, matches, admins

## Default Admin Credentials
- **Username**: admin
- **Password**: admin123

## API Endpoints

### Students
- `POST /api/students/register` - Register new student
- `POST /api/students/login` - Student login
- `PUT /api/students/{id}` - Update student profile and resume
- `GET /api/students/{id}` - Get student details
- `GET /api/students` - Get all students

### Companies
- `POST /api/companies/register` - Register new company
- `POST /api/companies/login` - Company login
- `GET /api/companies` - Get all companies

### Internships
- `POST /api/internships?company_id={id}` - Create internship
- `GET /api/internships` - Get all internships
- `GET /api/internships/company/{id}` - Get company's internships
- `DELETE /api/internships/{id}` - Delete internship

### AI Matching
- `POST /api/matches/generate/{student_id}` - Generate AI matches
- `GET /api/matches/student/{student_id}` - Get student's matches

### Admin
- `POST /api/admin/login` - Admin login
- `DELETE /api/admin/students/{id}` - Delete student
- `DELETE /api/admin/companies/{id}` - Delete company
- `GET /api/admin/stats` - Get system statistics

## ML Matching Algorithm

### Scoring Formula
\`\`\`
Total Score = Σ(Component Score × Dynamic Weight)

The weights start from the baseline distribution (35% skills, 20% location,
25% sector, 15% qualification, 5% affirmative bonus) and are continuously
updated using a feedback-driven learning loop that analyses hiring outcomes
and company comments. Positive signals reinforce the components that led to
successful matches while negative signals down-weight them.
\`\`\`

### Components
1. **Skill Match (35%)**: TF-IDF + Cosine Similarity
2. **Location Match (20%)**: Exact/Partial location matching
3. **Sector Match (25%)**: Industry preference alignment
4. **Qualification Match (15%)**: Education requirement matching
5. **Affirmative Bonus (5%)**: Diversity & inclusion factors

### Feedback-Driven Learning
- Every time matches are generated the engine analyses historical feedback
  (status changes such as *shortlisted*, *hired* or *rejected* and optional
  free-text comments).
- Component weights are nudged towards the factors that consistently appear in
  positive feedback and away from those correlated with negative outcomes.
- The latest weight distribution is returned alongside the generation
  response, allowing the frontend or administrators to inspect how the engine
  is adapting over time.

### Affirmative Action Factors
- Rural background: +5 points
- Aspirational district: +5 points
- SC/ST/OBC category: +5 points
- First-time participant: +5 points
- Maximum bonus: 20 points

## File Structure
\`\`\`
backend/
├── main.py              # FastAPI application & routes
├── database.py          # Database models & configuration
├── schemas.py           # Pydantic validation schemas
├── ml_engine.py         # AI matching algorithm
├── requirements.txt     # Python dependencies
├── run.sh              # Startup script
└── README.md           # This file
\`\`\`

## Troubleshooting

### Port Already in Use
\`\`\`bash
# Change port in run command
uvicorn main:app --reload --port 8001
\`\`\`

### Database Issues
Delete `internship.db` file and restart server to recreate database.

### CORS Errors
Frontend URL is whitelisted in `main.py`. Update if using different port.
