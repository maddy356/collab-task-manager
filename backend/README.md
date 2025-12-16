# Backend (Express + TypeScript + MongoDB + Socket.io)

## Setup
1) Copy env:
- `cp .env.example .env` (Windows: copy `.env.example` to `.env`)

2) Install & run:
```bash
npm install
npm run dev
```

## API
- POST `/api/auth/register` {name,email,password}
- POST `/api/auth/login` {email,password}
- POST `/api/auth/logout`
- GET `/api/users/me`
- PUT `/api/users/me` {name}
- GET `/api/users` (list users for assignment UI)
- GET `/api/tasks` (filters: status, priority, sort=dueDateAsc|dueDateDesc)
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`
- GET `/api/notifications`
- POST `/api/notifications/:id/read`

## Realtime
- `tasks:changed` (broadcast) => clients invalidate tasks query
- `notifications:new` (room user:<userId>) => clients refresh notifications
