# Frontend Documentation

## Overview
React-based frontend for the PM Internship Allocation System with responsive design and intuitive user interface.

## Tech Stack
- **React 18**: UI library
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client for API calls

## Setup Instructions

### 1. Install Node.js 18+
Make sure Node.js 18 or higher is installed on your system.

### 2. Install Dependencies
\`\`\`bash
cd frontend
npm install
\`\`\`

### 3. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

The app will be available at http://localhost:3000

### 4. Build for Production
\`\`\`bash
npm run build
\`\`\`

## Project Structure
\`\`\`
frontend/
├── src/
│   ├── api/
│   │   └── axios.js          # API configuration
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation bar
│   │   └── BackButton.jsx    # Go back button
│   ├── pages/
│   │   ├── Home.jsx          # Landing page
│   │   ├── StudentRegister.jsx
│   │   ├── StudentLogin.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── CompanyRegister.jsx
│   │   ├── CompanyLogin.jsx
│   │   ├── CompanyDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
\`\`\`

## Features

### Student Portal
- **Registration**: Complete profile with skills, location, preferences
- **Login**: Secure authentication
- **Dashboard**: View profile and AI-generated matches
- **Match Generation**: Click button to generate personalized matches
- **Match Details**: See detailed breakdown of match scores

### Company Portal (Next Task)
- Post internship opportunities
- View posted internships
- Manage internship listings

### Admin Dashboard (Next Task)
- View all students, companies, internships
- Delete any entry
- View system statistics

## API Integration
The frontend connects to the FastAPI backend at `http://localhost:8000/api`

All API calls are made through the configured Axios instance in `src/api/axios.js`

## Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: 
  - Primary: Blue (#2563eb)
  - Secondary: Dark Blue (#1e40af)
  - Accent: Light Blue (#3b82f6)

## User Flow

### Students
1. Register with complete profile
2. Login to dashboard
3. Generate AI matches
4. View ranked internship recommendations
5. See detailed match score breakdowns

## Troubleshooting

### Port Already in Use
Change port in `vite.config.js`:
\`\`\`js
server: {
  port: 3001
}
\`\`\`

### API Connection Issues
Ensure backend is running on port 8000 and update proxy in `vite.config.js` if needed.

### Build Errors
Clear node_modules and reinstall:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`
