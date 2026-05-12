# On-Road Vehicle Breakdown Assistance — Database Schema (MySQL)

Database name: `breakdown_assistance`

---

## Table: `users`

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| full_name | VARCHAR(255) | NOT NULL |
| phone | VARCHAR(20) | |
| role | ENUM('USER', 'MECHANIC') | NOT NULL, DEFAULT 'USER' |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

---

## Table: `mechanics`

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT | UNIQUE, NOT NULL, FK → users(id) ON DELETE CASCADE |
| latitude | DECIMAL(10,8) | |
| longitude | DECIMAL(11,8) | |
| is_online | BOOLEAN | DEFAULT FALSE |
| is_available | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

---

## Table: `breakdown_requests`

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT | NOT NULL, FK → users(id) |
| mechanic_id | BIGINT | FK → mechanics(id) |
| problem_type | ENUM('BATTERY_DEAD','TYRE_PUNCTURE','ENGINE_OVERHEATING','VEHICLE_NOT_STARTING') | NOT NULL |
| user_latitude | DECIMAL(10,8) | NOT NULL |
| user_longitude | DECIMAL(11,8) | NOT NULL |
| status | ENUM('PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','REJECTED') | NOT NULL, DEFAULT 'PENDING' |
| description | TEXT | |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

---

## Table: `chat_messages`

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| request_id | BIGINT | NOT NULL, FK → breakdown_requests(id) ON DELETE CASCADE |
| sender_type | ENUM('USER', 'MECHANIC', 'AI') | NOT NULL |
| message | TEXT | NOT NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Relationships

- **users** — One user can have one **mechanics** row (when role = MECHANIC).
- **breakdown_requests** — Many per **users** (user_id); many per **mechanics** (mechanic_id).
- **chat_messages** — Many per **breakdown_requests** (request_id).

---

## Optional indexes (for viva / performance)

```sql
CREATE INDEX idx_mechanics_online ON mechanics(is_online);
CREATE INDEX idx_mechanics_location ON mechanics(latitude, longitude);
CREATE INDEX idx_requests_status ON breakdown_requests(status);
CREATE INDEX idx_requests_user ON breakdown_requests(user_id);
```

Spring Data JPA with `ddl-auto: update` will create tables and basic indexes; add the above manually if needed.
