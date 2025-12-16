# Collaborative Task Manager (Final Submission)

## Abstract
A full-stack collaborative task manager that supports authentication, task creation and assignment, real-time task updates,
and persistent in-app notifications. The system uses MongoDB for flexible document storage and Socket.io for live updates.

## Tech Stack
- Frontend: React (Vite) + TypeScript + Tailwind CSS + React Query + React Hook Form + Zod
- Backend: Node.js + Express + TypeScript (Controllers/Services/Repositories + DTO validation with Zod)
- Database: MongoDB (Mongoose)
- Realtime: Socket.io

## Core Features (as required)
- Register / Login / Logout (JWT in HttpOnly cookie)
- Update Profile (change display name)
- Task CRUD with fields:
  - title, description, dueDate, priority, status, creatorId, assignedToId
- Realtime updates when tasks change
- Persistent notifications when tasks are assigned/reassigned

## Why MongoDB?
MongoDB fits the task domain well because tasks and notifications are document-like, evolve over time, and do not require
complex relational joins. Mongoose provides schema validation and references where needed.

## Project Structure
- `backend/` Express API with layered architecture:
  - controllers: HTTP handlers
  - services: business logic + socket events
  - repositories: database queries
  - dtos: validation using Zod
- `frontend/` React UI:
  - React Query for server state, caching, and refetching on realtime events
  - React Hook Form + Zod for forms and validation
  - Skeleton loaders for UX

## Local Setup
### 1) Backend
```bash
cd backend
copy .env.example .env   # (Windows) or: cp .env.example .env
npm install
npm run dev
```

### 2) Frontend
```bash
cd frontend
copy .env.example .env   # (Windows) or: cp .env.example .env
npm install
npm run dev
```

Open: http://localhost:5173

## Running Tests (backend)
```bash
cd backend
npm test
```

## Deployment (required)
- Database: MongoDB Atlas
- Backend: Render or Railway (set env vars from backend/.env.example)
- Frontend: Vercel (set VITE_API_URL to backend URL)

## API Contract (Backend)
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET  /api/users/me
- PUT  /api/users/me
- GET  /api/users
- GET  /api/tasks (filters: status, priority, sort)
- POST /api/tasks
- PUT  /api/tasks/:id
- DELETE /api/tasks/:id
- GET  /api/notifications
- POST /api/notifications/:id/read

## Notes
- Cookies: JWT stored in HttpOnly cookie (frontend never reads token directly).
- Realtime:
  - tasks:changed => refresh tasks
  - notifications:new => refresh notifications
