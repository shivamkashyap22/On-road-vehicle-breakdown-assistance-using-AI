# On-Road Vehicle Breakdown Assistance — API Endpoints

Base URL: `http://localhost:8080` (or your backend URL)

---

## Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register (body: email, password, fullName, phone?, role: USER \| MECHANIC) | No |
| POST | `/api/auth/login` | Login (body: email, password). Returns JWT. | No |
| GET | `/api/auth/me` | Current user profile (id, email, fullName, role) | JWT |

---

## Breakdown Requests

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/breakdown/request` | Create request (body: problemType, userLatitude, userLongitude, description?) | User JWT |
| GET | `/api/breakdown/my-requests` | List current user's requests | User JWT |
| GET | `/api/breakdown/{id}` | Get request by ID | JWT (owner or assigned mechanic) |
| PATCH | `/api/breakdown/{id}/accept` | Mechanic accepts request | Mechanic JWT |
| PATCH | `/api/breakdown/{id}/reject` | Mechanic rejects request | Mechanic JWT |
| PATCH | `/api/breakdown/{id}/start` | Mechanic marks en route / in progress | Mechanic JWT |
| PATCH | `/api/breakdown/{id}/complete` | Mechanic marks job completed | Mechanic JWT |

---

## Mechanic

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/mechanic/incoming` | List incoming (PENDING) requests | Mechanic JWT |
| PATCH | `/api/mechanic/status` | Toggle online/offline | Mechanic JWT |
| PUT | `/api/mechanic/location` | Update location (body: latitude, longitude) | Mechanic JWT |

---

## Chat

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat` | Send message (body: requestId, message). Returns AI reply for user. | JWT |
| GET | `/api/chat/{requestId}` | Chat history for a request | JWT |

---

## WebSocket (STOMP)

- **Connect**: `ws://localhost:8080/ws` (use SockJS: `http://localhost:8080/ws`)

- **Subscribe (user)**  
  - `/topic/request/{requestId}` — receive status updates and mechanic location for a request

- **Send (mechanic)**  
  - Destination: `/app/location/{requestId}`  
  - Body: `{ "latitude": number, "longitude": number }`  
  - Broadcasts to `/topic/request/{requestId}` so the user’s map can update

---

## Problem types (enum)

- `BATTERY_DEAD`
- `TYRE_PUNCTURE`
- `ENGINE_OVERHEATING`
- `VEHICLE_NOT_STARTING`

## Request status (enum)

- `PENDING`
- `ACCEPTED`
- `IN_PROGRESS`
- `COMPLETED`
- `REJECTED`
