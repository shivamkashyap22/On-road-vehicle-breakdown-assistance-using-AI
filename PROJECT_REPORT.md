## Project Report: On-Road Vehicle Breakdown Assistance System Using AI

### 1) Overview
This project is a full-stack web application that connects drivers with nearby mechanics during vehicle breakdowns. It adds AI chat assistance and live tracking to improve user support and response time. The system targets a demo-ready academic project with a clear separation of frontend, backend, and database layers.

### 2) Objectives
- Provide a simple workflow for drivers to request help.
- Allow mechanics to accept and track requests in real time.
- Offer AI-based chat guidance during the breakdown.
- Maintain secure access using JWT-based authentication.
- Store all requests and chat history in a relational database.

### 3) Architecture and Stack
**Frontend (Vite + React)**  
- UI for user and mechanic roles.  
- Real-time tracking via WebSocket (SockJS + STOMP).  
- Map visualization using Google Maps JavaScript API.  
- Tailwind CSS for styling and Framer Motion for animations.

**Backend (Spring Boot)**  
- REST APIs for authentication, requests, mechanic status, and chat.  
- JWT-based security with role-based access (USER/MECHANIC).  
- WebSocket endpoint for live location updates.  
- Optional OpenAI integration to generate AI chat responses.

**Database (MySQL)**  
- Users, mechanics, breakdown requests, and chat messages.  
- Relationships to connect drivers, mechanics, and request histories.

### 4) Project Structure
```
backend/   - Spring Boot application
frontend/  - Vite + React application
API_ENDPOINTS.md
DATABASE_SCHEMA.md
SETUP_GUIDE.md
README.md
```

### 5) Core Features Implemented
- User registration, login, and profile via JWT.
- Breakdown request creation with problem type and location.
- Mechanic dashboard with online/offline status and request handling.
- Live tracking of mechanic location through WebSocket topics.
- AI chat linked to a request, stored in chat history.
- Dummy payment flow after completion.

### 6) Data Model Summary
- `users`: stores login and role information.
- `mechanics`: stores mechanic status and location.
- `breakdown_requests`: tracks each assistance request.
- `chat_messages`: stores messages from user, mechanic, and AI.

### 7) API and Real-Time Communication
**REST APIs**  
Endpoints cover authentication, request lifecycle, mechanic status, location updates, and chat.

**WebSocket (STOMP)**  
- Mechanics send live location updates to `/app/location/{requestId}`.  
- Users subscribe to `/topic/request/{requestId}` for status and location.

### 8) Configuration and Environment
Key configurations required to run the project:
- MySQL database credentials in `backend/src/main/resources/application.yml`.
- JWT secret and optional OpenAI key in the backend.
- Google Maps API key in `frontend/.env`.

### 9) How the Project Is Being Created (Development Flow)
1. **Design the system**: Define roles (USER/MECHANIC), request lifecycle, and real-time tracking needs.  
2. **Set up backend**:  
   - Build Spring Boot services for auth, requests, mechanics, and chat.  
   - Configure JWT authentication and role checks.  
   - Add WebSocket endpoints for live tracking.  
3. **Model the database**:  
   - Create tables for users, mechanics, requests, and chats.  
   - Link tables with foreign keys for data integrity.  
4. **Build frontend UI**:  
   - Create user and mechanic dashboards.  
   - Integrate Google Maps and problem selection.  
   - Add WebSocket client to receive live updates.  
5. **Integrate AI**:  
   - Add OpenAI API usage in chat controller.  
   - Store and return AI responses per request.  
6. **Test the end-to-end flow**:  
   - Register a user and mechanic.  
   - Create a request, accept it, send location updates.  
   - Verify chat and completion flow.

### 10) Future Enhancements (Optional)
- Real payment gateway integration.
- Mechanic rating and feedback system.
- Geo-distance based mechanic matching.
- Admin dashboard for monitoring requests and users.

---

**Project Title**: On-Road Vehicle Breakdown Assistance System Using AI  
**Purpose**: MCA final year project with live tracking, AI chat, and real-time assistance.
