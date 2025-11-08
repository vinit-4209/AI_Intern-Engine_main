
# 🚀 AI Intern Engine

**AI Intern Engine** is a full-stack web application designed to assist in AI-powered internship matching and resume analysis.  
It consists of a **Python backend** (for AI processing and APIs) and a **React + Vite frontend** (for the user interface).

---

## 🧩 Project Structure

```

AI_Intern Engine/
│
├── backend/               # Python backend (API, ML models, database)
│   ├── main.py             # Entry point for backend server
│   ├── ml_engine.py        # Machine learning logic
│   ├── database.py         # SQLite database management
│   ├── schemas.py          # Data schemas / models
│   ├── requirements.txt    # Python dependencies
│   └── internship.db       # Local database file
│
└── frontend/              # React (Vite + TailwindCSS) frontend
├── package.json        # Node.js dependencies and scripts
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # TailwindCSS setup
├── src/                # Frontend source code
└── index.html          # Entry HTML file

````

---

## ⚙️ Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) → [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) → [Download here](https://www.python.org/)
- **pip** → comes with Python
- **Git** (optional, for version control)

--

## Backend Setup (Python)

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd "AI_Intern Engine/backend"
````

2. Create a virtual environment (recommended):

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   * **Windows (PowerShell):**

     ```bash
     venv\Scripts\activate
     ```
   * **macOS/Linux:**

     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Run the backend server:

   ```bash
   python main.py
   ```

6. The API should now be running at:
   
   
uvicorn main:app --reload
   ```
   http://127.0.0.1:8000
   ```

---

## 💻 Frontend Setup (React + Vite)

1. Open a new terminal and go to the frontend directory:

   ```bash
   cd "AI_Intern Engine/frontend"
   ```

2. Install dependencies:

   ```bash
   npm install
   ```
   npm install lucide-react
   ```


3. Start the development server:

   ```bash
   npm run dev
   ```

4. You should see output similar to:

   ```
   VITE vX.X.X  ready in Xs
     ➜  Local: http://localhost:5173/
   ```

5. Open the provided local URL in your browser.

---

## 🔗 Connecting Frontend and Backend

Make sure both servers are running simultaneously:

| Service          | Command          | Default URL             |
| ---------------- | ---------------- | ----------------------- |
| Backend (Python) | `python main.py` | `http://127.0.0.1:8000` |
| Frontend (Vite)  | `npm run dev`    | `http://localhost:5173` |

If your frontend needs to make API requests, update the base API URL (e.g., in `src/api.js` or `.env`) to:

```
http://127.0.0.1:8000
```

---

## 🧪 Testing

* Backend testing can be done via **Postman** or **cURL** using endpoints from `main.py`.
* Frontend testing can be done through browser inspection and console logs.

---

## 🛠 Troubleshooting

| Problem                                  | Possible Cause                         | Solution                                     |
| ---------------------------------------- | -------------------------------------- | -------------------------------------------- |
| `npm ERR! enoent package.json not found` | You’re in the wrong folder             | Run `cd frontend` before `npm run dev`       |
| Backend fails to start                   | Missing dependencies                   | Run `pip install -r requirements.txt`        |
| Frontend doesn’t load                    | Port conflict or missing node_modules  | Stop other Vite apps or re-run `npm install` |
| CORS errors                              | Backend not allowing frontend requests | Add CORS middleware in `main.py`             |

---

## 📚 Technologies Used

### Backend

* Python
* FastAPI / Flask
* SQLite
* Machine Learning (custom engine in `ml_engine.py`)

### Frontend

* React
* Vite
* Tailwind CSS

---


## 🧾 License

This project is licensed under the MIT License — feel free to modify and use it as needed.

---

### ✨ Author

[Your Name]
💼 AI Developer & Intern
📍 Project: *AI Intern Engine*

```

---

