# Placement Preparation & Job Application Tracker

A modern, full-stack web application designed to help college students and job seekers manage their recruitment pipeline and systematically prepare for technical interviews across **Data Structures & Algorithms (DSA)**, **SQL Challenges**, **Aptitude**, and **Core Computer Science Subjects** (OS, DBMS, Computer Networks, OOP).

---

## Resume Highlights & Project Description

> **Placement Preparation & Job Application Tracker — Full-Stack Web Application**  
> *React.js, FastAPI, MySQL, JWT, Docker, Git/GitHub, AWS*  
> • Developed a full-stack web application to manage student job applications and placement preparation.  
> • Built RESTful APIs using FastAPI and MySQL for managing users, applications, application statuses, and preparation data.  
> • Designed an interactive dashboard with an algorithmic **Placement Readiness Index** to track progress across DSA, SQL, aptitude, and technical subjects.  
> • Implemented JWT-based authentication with bcrypt password hashing and containerized the application using Docker for cloud deployment on AWS.

---

## Tech Stack

| Layer | Technologies | Description |
| :--- | :--- | :--- |
| **Frontend** | **React.js 18**, **Tailwind CSS**, **Vite**, **Lucide Icons**, **Axios** | Single-page application with responsive dark mode UI, interactive Kanban board, progress bars, and modal forms. |
| **Backend** | **FastAPI** (Python 3.11), **Pydantic v2**, **SQLAlchemy ORM** | Async RESTful API with automated Swagger/OpenAPI documentation and modular routing architecture. |
| **Database** | **MySQL 8.0** / **SQLite** (Auto-fallback) | Relational schema with foreign keys, cascading deletes, and connection pooling. |
| **Security** | **JWT (JSON Web Tokens)**, **Passlib (Bcrypt)** | Stateless Bearer token authentication, password hashing, and protected routes. |
| **DevOps** | **Docker**, **Docker Compose**, **Nginx**, **GitHub Actions** | Multi-stage container builds, automated CI/CD pipeline, and healthcheck orchestration. |
| **Cloud** | **AWS (ECS Fargate / EC2)**, **RDS Aurora MySQL**, **ALB** | Production cloud deployment task definitions, reverse proxy, and runbooks. |

---

## Architecture

```
                                  BROWSER
                       (React 18 + Tailwind CSS + Vite)
                                     │
                        HTTP / HTTPS │ Authorization: Bearer <JWT>
                                     ▼
                      FASTAPI APPLICATION (Port 8000)
    ┌────────────────────────────────┬───────────────────────────────┐
    │                                │                               │
    ▼                                ▼                               ▼
/api/v1/auth                 /api/v1/applications              /api/v1/prep
• Register & Login           • CRUD Applications               • DSA Topic Bank
• JWT Bearer Token           • Stage Transition                • SQL Challenges
• Student Profile            • Funnel Analytics                • Aptitude Tracker
                             • Table / Kanban Views            • Core CS Subjects
    │                                │                               │
    └────────────────────────────────┼───────────────────────────────┘
                                     ▼
                            SQLAlchemy 2.0 ORM
                                     ▼
                         DATABASE (MySQL 8.0 / SQLite)
```

---

## Key Features

### 1. Job Application Pipeline Tracker
- **Dual Views**: Switch seamlessly between **Table View** and **Interactive Kanban Board**.
- **Stage Progression**: Track stages from `Applied` ➔ `Online Assessment` ➔ `Technical Round 1/2` ➔ `HR Round` ➔ `Offered 🎉` / `Rejected`.
- **Search & Filter**: Search by company, role, location, or filter by application stage.
- **Key Milestones**: Track interview dates and deadlines with upcoming milestone notifications.

### 2. Algorithmic Placement Readiness Index
- Composite score (0 - 100) dynamically calculated across preparation pillars:
  - **40% Data Structures & Algorithms** (Pattern completion rate)
  - **25% Core CS Subjects** (Mastered concepts in OS, DBMS, Networks, OOP)
  - **20% SQL Queries** (Solved query challenges)
  - **15% Aptitude & Reasoning** (Completed practice questions)

### 3. DSA Question Bank & Progress Sheet
- Curated high-frequency patterns (Arrays, Two Pointers, Sliding Window, Trees, DP, Graphs).
- Difficulty badges (`Easy`, `Medium`, `Hard`), direct **LeetCode** problem links.
- "Needs Revision" bookmarking flag.
- Custom algorithm notes modal for each problem to record time/space complexities and edge cases.

### 4. SQL Practice Suite
- Real interview questions on **Window Functions**, **Self Joins**, **CTEs**, **Aggregations**, and **Subqueries**.
- Interactive query editor to save your SQL solutions.
- "Reveal Canonical SQL" solution toggle with explanations.

### 5. Aptitude & Reasoning Syllabus
- Covers **Quantitative Ability** (Percentages, Time & Distance, Work & Time, P&C, Probability), **Logical Reasoning** (Blood Relations, Seating, Syllogisms), and **Verbal Ability**.
- Built-in formulas and shortcut cheat sheets for each topic.
- Interactive question counter and accuracy percentage logging.

### 6. Core Computer Science Revision
- High-yield interview concept summaries for **Operating Systems**, **DBMS**, **Computer Networks**, and **OOP / System Design**.
- High-frequency interview Q&A flashcards.
- 5-star student confidence rating system and concept mastery tracking (`Not Started`, `In Progress`, `Mastered`).

---

## Quick Start with Docker (Recommended)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) & [Docker Compose](https://docs.docker.com/compose/install/)

### Run the entire application with one command:
```bash
# Clone the repository
git clone https://github.com/your-username/placement-tracker.git
cd placement_tracker

# Launch MySQL, FastAPI backend, and React frontend
docker compose up -d --build
```

### Access URLs:
- **React Frontend**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Interactive API Docs**: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- **phpMyAdmin (Database GUI)**: [http://localhost:8081](http://localhost:8081)

### Pre-seeded Demo Credentials:
The application automatically seeds curated problems and a demo student account on first boot:
- **Email**: `demo@student.com`
- **Password**: `password123`
*(Or click the "Fill Demo Account" button directly on the login screen!)*

---

## Local Development (Without Docker)

If you wish to run the backend and frontend locally without Docker:

### 1. Backend Setup (FastAPI)
```bash
cd backend

# Create and activate Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Seed the database tables and curriculum
python seed_db.py

# Run FastAPI development server
uvicorn app.main:app --reload --port 8000
```
> *Note: By default, if `DATABASE_URL` is not set to a MySQL instance, the backend gracefully falls back to SQLite (`sqlite:///./placement_tracker.db`) for instant zero-config setup!*

### 2. Frontend Setup (React.js + Vite)
```bash
cd frontend

# Install npm packages
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## REST API Reference

The FastAPI backend provides interactive Swagger documentation at `/api/v1/docs`.

### Authentication & User
- `POST /api/v1/auth/register` - Create new student account.
- `POST /api/v1/auth/login-json` - Authenticate and retrieve JWT Bearer token.
- `GET /api/v1/auth/me` - Fetch profile of logged-in student.
- `PUT /api/v1/auth/me` - Update profile, college, and placement goals.

### Job Applications
- `GET /api/v1/applications` - List applications (supports `search`, `status`, `job_type`).
- `POST /api/v1/applications` - Add a new application.
- `GET /api/v1/applications/stats/summary` - Pipeline counts & conversion rates.
- `PUT /api/v1/applications/{id}` - Update application details or stage.
- `DELETE /api/v1/applications/{id}` - Delete application.

### Placement Preparation
- `GET /api/v1/prep/dsa` - Get DSA problems grouped by pattern with user progress.
- `PUT /api/v1/prep/dsa/problems/{id}/progress` - Update DSA solved status/notes/revision.
- `GET /api/v1/prep/sql` - Get SQL interview challenges.
- `PUT /api/v1/prep/sql/problems/{id}/progress` - Save SQL query solution and status.
- `GET /api/v1/prep/aptitude` - Get aptitude modules and formulas.
- `PUT /api/v1/prep/aptitude/topics/{id}/progress` - Update questions completed and accuracy.
- `GET /api/v1/prep/core` - Get core CS concepts (OS, DBMS, Networks, OOP).
- `PUT /api/v1/prep/core/topics/{id}/progress` - Update concept mastery and confidence rating.

### Dashboard
- `GET /api/v1/dashboard/stats` - Consolidated placement readiness score, upcoming interviews, and category breakdown.

---

## AWS Cloud Deployment

Complete production deployment assets are available in the [`deploy/`](./deploy/) directory:
- [`deploy/aws-architecture.md`](./deploy/aws-architecture.md): Cloud architecture diagram and setup guide (ALB + ECS Fargate + RDS MySQL).
- [`deploy/aws-ecs-task-def.json`](./deploy/aws-ecs-task-def.json): Amazon ECS Fargate Task Definition with CloudWatch logging and Secrets Manager integration.
- [`deploy/deploy-ec2.sh`](./deploy/deploy-ec2.sh): One-click deployment script for AWS EC2 instances.

---

## License
MIT License. Built for students, job applicants, and aspiring software engineers.
