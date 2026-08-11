# E-Motion - Student Health and Wellness Platform

E-Motion is a web-based health and wellness management platform designed for university students. The application provides tools to track daily physical activity, monitor hydration and sleep, access mental health resources, and view campus events.

---

## Deployments and Live Links

* Frontend Application: https://e-motion-iota.vercel.app
* Backend API Base URL: https://e-motion-7vds.onrender.com
* Swagger OpenAPI Documentation: https://e-motion-7vds.onrender.com/apidocs

---

## Core Features

* Dashboard Overview: Displays real-time metrics including daily step counts, physical activity, calorie expenditure, water consumption, and sleep hours.
* Water Tracking: Allows users to log daily water intake and monitor progress against set targets.
* Activity Streak System: Calculates and presents consecutive days of user activity.
* Mental Health Module: Provides access to breathing exercises, meditation resources, and self-assessment tools.
* Campus Events and Challenges: Displays current university wellness programs and activity schedules.
* User Authentication: Handles registration, login, and authorization using JSON Web Tokens (JWT).
* System Health Monitoring: Features a dedicated `/health` endpoint for uptime tracking and service keep-alive integrations.

---

## Tech Stack

### Frontend
* Framework: Next.js 14 (React, TypeScript)
* Styling: CSS3 (Custom Responsive Styles)
* Icons: Lucide React
* Hosting: Vercel

### Backend
* Runtime & Framework: Python, Flask
* API Documentation: Flasgger (OpenAPI Specification)
* Database: SQLite
* Hosting: Render

---

## Repository Structure

```text
Holberton-Final Project/
├── backend/
│   ├── app.py                 # Application entry point and REST routes
│   ├── kuds_database.db       # SQLite database file
│   ├── Procfile               # Deployment configuration for Render
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables (git-ignored)
│
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── globals.css    # Global stylesheet and media queries
│   │       ├── layout.tsx     # Root application layout
│   │       └── page.tsx       # Main dashboard component
│   ├── package.json           # Node.js dependencies
│   └── next.config.ts         # Next.js configuration settings
│
└── README.md                  # Project documentation
```

---

## Environment Variables

Configure the following environment variables in the `backend/.env` file:

```env
FLASK_ENV=production
SECRET_KEY=your_jwt_secret_key
PORT=5050
DATABASE_URL=sqlite:///kuds_database.db
```

For the frontend application, set the backend API endpoint:

```env
NEXT_PUBLIC_API_URL=https://e-motion-7vds.onrender.com
```

---

## Local Development Setup

### Prerequisites
* Python 3.10 or higher
* Node.js 18.x or higher
* npm or yarn package manager

### 1. Clone Repository
```bash
git clone https://github.com/alihasanzada/E-Motion.git
cd "Holberton-Final Project"
```

### 2. Backend Installation
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
The Flask backend will be accessible at `http://127.0.0.1:5050`.

### 3. Frontend Installation
```bash
cd ../frontend
npm install
npm run dev
```
The Next.js client will run on `http://localhost:3000`.

---

## Key API Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| GET | `/health` | Returns server health status and uptime |
| GET | `/apidocs` | Renders interactive Swagger UI |
| POST | `/api/auth/login` | Authenticates user credentials and returns JWT |
| GET | `/api/notifications` | Fetches notification list for authenticated user |
| POST | `/api/notifications/read-all` | Marks all active notifications as read |

---

## Authors & Team

* Ali Hasanzada - https://github.com/alihasanzada
* Akbar Aliyev - https://github.com/akbar-ako
* Laman Azizli - https://github.com/lemazizli
* Murad Quliyev - https://github.com/QuliyevMR