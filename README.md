# 🚀 Distributed Task Scheduler Platform

A **production-grade distributed task scheduling system** with retry mechanisms, dead-letter queue, worker processing, and real-time monitoring dashboard.

---

## 🧠 Problem It Solves

Modern systems need to:
- Run background jobs reliably
- Handle failures gracefully
- Retry intelligently
- Track execution status

This project simulates how real-world systems like **Stripe / Netflix** handle asynchronous job processing.

---

## ⚙️ Tech Stack

### Backend
- Node.js (ES Modules)
- Express.js
- PostgreSQL (source of truth)
- Redis (queue system)
- Zod (validation)
- Pino (logging)

### Frontend
- Next.js (App Router)
- Tailwind CSS

---

## 🏗️ Architecture
Client → API → PostgreSQL
↓
Scheduler (polling)
↓
Redis Queue
↓
Worker
↓
Task Execution


---

## ✨ Features

### 🧾 Task System
- Create tasks (one-time / delayed)
- Store task metadata & payload
- Track lifecycle

### ⚡ Scheduler
- Polls DB every second
- Moves due tasks → Redis queue
- Ensures no task loss

### 👷 Worker
- Processes tasks asynchronously
- Supports multiple workers (scalable)

### 🔁 Retry Mechanism
- Exponential backoff
- Configurable retry count
- Auto-rescheduling

### ☠️ Dead Letter Queue (DLQ)
- Failed tasks after max retries
- Separate monitoring & recovery

### 🔄 Retry from DLQ
- Manually retry failed tasks
- Move DEAD → PENDING → reprocess

### 📊 Metrics Dashboard
- Success rate
- Failure rate
- Dead tasks %
- Retry count

### 📋 Pagination + Filtering
- Scalable task listing
- Page-based navigation

### 🧠 Observability
- Structured logging (Pino)
- Execution timeline per task

---

## 📂 Project Structure
![alt text](image.png)


## 🔄 Task Lifecycle


PENDING → QUEUED → PROCESSING → SUCCESS
↓
FAILED → RETRYING → ...
↓
DEAD (DLQ)


---

## 🧪 Example Flow

1. Create Task
2. Scheduler picks it
3. Worker executes
4. If fails → retry
5. If max retries reached → DLQ
6. User can retry manually

---

## 🛠️ Setup Instructions

---

### 🔹 1. Clone Repo

```bash
git clone https://github.com/<your-username>/task-scheduler-platform.git
cd task-scheduler-platform
🔹 2. Backend Setup
cd task_scheduler
npm install

Create .env:

PORT=5000

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=scheduler_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

REDIS_URL=your_redis_url

SCHEDULER_INTERVAL_MS=1000
MAX_RETRIES=3
RETRY_BASE_DELAY_MS=5000

Run:

npm run dev
npm run worker
🔹 3. Frontend Setup
cd scheduler-frontend
npm install
npm run dev
🌐 API Endpoints
Method	Endpoint	Description
POST	/api/tasks	Create task
GET	/api/tasks	Get paginated tasks
GET	/api/tasks/:id	Task details
GET	/api/tasks/dlq	Dead tasks
POST	/api/tasks/:id/retry	Retry task
GET	/api/tasks/metrics	System metrics
📊 Metrics Example
{
  "total": 50,
  "successRate": "82.00",
  "failureRate": "10.00",
  "deadRate": "8.00",
  "retried": 12
}
🧠 Design Decisions
PostgreSQL = Source of truth
Redis = Fast queue layer
DB polling = Simplicity + reliability
Retry logic handled in service layer
DLQ implemented for failure isolation
🚀 Future Improvements
WebSocket-based real-time updates
Leader election for scheduler
Rate limiting & auth
Task priority queue
Distributed locking
Kubernetes deployment
📸 Screenshots (Add here)
Dashboard
Task Timeline
DLQ Page
Metrics Page
👨‍💻 Author

Shivam

⭐ Why This Project Matters

This project demonstrates:

Distributed system design
Async processing
Fault tolerance
Observability
Scalable backend architecture

Built with focus on real-world backend engineering principles 🚀