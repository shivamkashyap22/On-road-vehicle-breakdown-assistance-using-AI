# On-Road Vehicle Breakdown Assistance System Using AI

MCA Final Year Project — Full-stack web application for requesting and providing on-road vehicle breakdown assistance with AI chat and live tracking.

## Tech stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React (Vite), Tailwind CSS, Framer Motion, Lucide React, Axios, SockJS + STOMP, Google Maps JS API |
| Backend | Java 17, Spring Boot, Spring Security (JWT), Spring Data JPA, WebSocket (STOMP), OpenAI API |
| Database | MySQL 8 |

## Project structure

```
├── backend/          # Spring Boot application
├── frontend/         # Vite + React application
├── API_ENDPOINTS.md  # REST & WebSocket API list
├── DATABASE_SCHEMA.md
├── SETUP_GUIDE.md
└── README.md
```

## Quick start

1. **MySQL**: Create database `breakdown_assistance` and set credentials in `backend/src/main/resources/application.yml`.
2. **Backend**:  
   `cd backend && ./mvnw spring-boot:run`  
   Set `jwt.secret` and optionally `openai.api-key` (or `OPENAI_API_KEY` env).
3. **Frontend**:  
   `cd frontend && npm install && npm run dev`  
   Create `frontend/.env` from `frontend/.env.example` and set `VITE_GOOGLE_MAPS_API_KEY` for the map.

See **SETUP_GUIDE.md** for detailed steps (MySQL, JWT, OpenAI, Google Maps, troubleshooting).

## Features

- **User (driver)**: Landing, register/login, dashboard with map and problem selection (Battery, Tyre, Overheating, Not starting), request mechanic, status timeline, live mechanic tracking, AI chat, dummy payment with success animation.
- **Mechanic**: Login, online/offline toggle, incoming request cards, accept/reject, map with user location, live location updates via WebSocket, job completion modal.
- **Backend**: JWT auth, role-based access (USER/MECHANIC), REST APIs for auth, breakdown requests, mechanic status/location, chat; WebSocket for live tracking; optional OpenAI integration for chat.

## Documentation

- **API_ENDPOINTS.md** — All REST endpoints and WebSocket topics.
- **DATABASE_SCHEMA.md** — MySQL tables and relationships.
- **SETUP_GUIDE.md** — Environment, keys, run order, and troubleshooting.

---

**Title**: On-Road Vehicle Breakdown Assistance System Using AI  
**Purpose**: MCA final year project — demo-ready, viva-friendly, resume-ready.


## Developed By

**Shivam Kashyap**

