# On-Road Vehicle Breakdown Assistance — Setup Guide

This guide helps you run the full-stack project (backend + frontend) and configure API keys for the MCA final year project.

---

## Prerequisites

- **Java 17** (OpenJDK or Oracle)
- **Node.js 18+** and npm
- **MySQL 8** (or 5.7)
- **Maven** (or use wrapper: `./mvnw`)

---

## 1. MySQL setup

1. Install and start MySQL.
2. Create database and user (optional; app can create DB if allowed):

```sql
CREATE DATABASE IF NOT EXISTS breakdown_assistance;
-- If you use a dedicated user:
CREATE USER 'breakdown'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL ON breakdown_assistance.* TO 'breakdown'@'localhost';
FLUSH PRIVILEGES;
```

3. Update `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/breakdown_assistance?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true
    username: root          # or your user
    password: root          # your MySQL password
```

The app uses `ddl-auto: update`, so tables will be created/updated on first run.

---

## 2. Backend (Spring Boot)

1. **JWT secret** (required)

In `application.yml`:

```yaml
jwt:
  secret: your-256-bit-secret-key-for-jwt-signing-change-in-production
  expiration-ms: 86400000
```

Use a long random string in production.

2. **OpenAI API key** (optional for AI chat)

- Get an API key from [OpenAI](https://platform.openai.com/api-keys).
- Either set in `application.yml`:

```yaml
openai:
  api-key: sk-your-actual-key
```

Or set environment variable:

```bash
export OPENAI_API_KEY=sk-your-actual-key
```

If not set, the chat will return a friendly “configure API key” message.

3. **Run the backend**

```bash
cd backend
./mvnw spring-boot:run
```

Or from IDE: run `com.breakdown.BreakdownApplication`.

Backend will be at **http://localhost:8080**.

---

## 3. Frontend (Vite + React)

1. **Install dependencies**

```bash
cd frontend
npm install
```

2. **Environment variables**

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

- **VITE_API_URL**: Backend base URL (defaults to `http://localhost:8080` if omitted).
- **VITE_GOOGLE_MAPS_API_KEY**: Required for the map. Get it from [Google Cloud Console](https://console.cloud.google.com/):
  - Enable **Maps JavaScript API**.
  - Create an API key and restrict by HTTP referrer (e.g. `http://localhost:5173/*`) for development.

3. **Run the frontend**

```bash
npm run dev
```

Frontend will be at **http://localhost:5173**.

---

## 4. Quick test flow

1. **Register**
   - Open http://localhost:5173 → Register.
   - Create one **User** (driver) and one **Mechanic** (use “I'm a mechanic” or set role to Mechanic).

2. **User (driver)**
   - Login as user → Dashboard.
   - Allow browser location for the map.
   - Select a problem (e.g. Battery Dead) → “Request Mechanic”.
   - Open “Request status” and, if a mechanic is online, see status/updates.
   - Use “Chat” for that request to talk to the AI (if OpenAI key is set).
   - After status “Completed”, open “Proceed to payment” for the dummy payment.

3. **Mechanic**
   - Login as mechanic → Mechanic dashboard.
   - Turn **Online**.
   - Accept an incoming request → update location (or use “Mark completed” for demo).
   - User side can see live tracking if the mechanic sends location via WebSocket.

---

## 5. Production-style checklist

- Change `jwt.secret` to a strong random value.
- Set `OPENAI_API_KEY` (or `openai.api-key`) for AI chat.
- Use a proper MySQL user and strong password; avoid `allowPublicKeyRetrieval=true` if not needed.
- Restrict Google Maps API key by referrer and (if possible) by API.
- Build frontend: `cd frontend && npm run build`; serve the `dist` folder (e.g. Nginx or same backend).
- Configure CORS in `SecurityConfig` for your frontend origin only.

---

## 6. Troubleshooting

| Issue | What to check |
|-------|----------------|
| Backend won’t start | MySQL running? DB name, user, password in `application.yml`? Java 17? |
| 401 on API calls | User logged in? Token in `Authorization: Bearer <token>`? |
| Map not loading | `VITE_GOOGLE_MAPS_API_KEY` set? Maps JavaScript API enabled? |
| No AI reply in chat | `openai.api-key` or `OPENAI_API_KEY` set? Valid OpenAI key? |
| WebSocket not connecting | Backend and frontend URLs in CORS/WebSocket config (e.g. `http://localhost:5173`). |

---

**Project**: On-Road Vehicle Breakdown Assistance System Using AI  
**Stack**: React (Vite), Tailwind, Framer Motion, Spring Boot, JWT, WebSocket (STOMP), MySQL, OpenAI.
