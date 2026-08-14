# FinTrack — Income & Expense Tracker

A production-ready full-stack personal finance application built with **React + TypeScript** on the frontend and **FastAPI + Python** on the backend, backed by **PostgreSQL** and fully containerized with **Docker**.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with access + refresh tokens
- 💰 **Transaction Management** — Create, edit, delete, search, filter, sort, paginate income/expense transactions
- 🏦 **Multi-Account Support** — Cash, Bank, Credit Card, Mobile Wallet, Savings
- 🗂️ **Category System** — Customizable income & expense categories
- 💸 **Transfers** — Transfer funds between accounts without affecting income/expense totals
- 📊 **Dashboard** — Visual financial overview with charts and summary cards
- 🎯 **Budget Tracking** — Set monthly budgets with real-time spending progress
- 📈 **Reports** — Income, expense, monthly summary, and category reports
- 📤 **Data Export** — Export to CSV, Excel, and PDF
- 🔒 **Data Isolation** — Each user's data is completely isolated
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Python 3.12 | Language |
| FastAPI | Web framework |
| SQLAlchemy 2.x (async) | ORM |
| Alembic | Database migrations |
| PostgreSQL 16 | Database |
| asyncpg | Async PostgreSQL driver |
| Pydantic v2 | Data validation |
| PyJWT | JWT tokens |
| passlib/bcrypt | Password hashing |
| openpyxl | Excel exports |
| reportlab | PDF exports |
| slowapi | Rate limiting |
| Pytest | Testing |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| TanStack Query | Server state management |
| React Router v6 | Routing |
| React Hook Form | Form management |
| Zod | Schema validation |
| Recharts | Charts |
| Zustand | Auth state |
| Axios | HTTP client |
| Lucide React | Icons |

### Infrastructure
| Technology | Purpose |
|-----------|---------|
| Docker + Docker Compose | Containerization |
| Nginx | Reverse proxy |
| PostgreSQL 16 | Database |

---

## 📁 Project Structure

```
income-expense-tracker/
├── frontend/                   # React + TypeScript app
│   ├── src/
│   │   ├── api/               # API client functions
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Base UI primitives
│   │   │   ├── dashboard/     # Dashboard-specific components
│   │   │   └── transactions/  # Transaction components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Page layout components
│   │   ├── pages/             # Route pages
│   │   ├── routes/            # Route guards
│   │   ├── stores/            # Zustand stores
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Helper utilities
│   └── Dockerfile
│
├── backend/                    # FastAPI + Python app
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/        # API route handlers
│   │   ├── core/              # Config, database, security
│   │   ├── models/            # SQLAlchemy models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic layer
│   │   ├── repositories/      # Data access layer
│   │   └── utils/             # Seed data, helpers
│   ├── alembic/               # Database migrations
│   ├── tests/                 # Pytest test suite
│   └── Dockerfile
│
├── nginx/                      # Reverse proxy config
├── database/                   # DB initialization scripts
├── docker-compose.yml          # Development Docker Compose
├── docker-compose.prod.yml     # Production overrides
├── .env.example                # Environment variable template
├── Makefile                    # Development shortcuts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git

### 1. Clone the repository
```bash
git clone <repository-url>
cd income-expense-tracker
```

### 2. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` and update at minimum:
- `POSTGRES_PASSWORD` — Choose a strong password
- `SECRET_KEY` — Generate a random 32+ character secret (e.g., `openssl rand -hex 32`)

### 3. Start the application
```bash
docker compose up -d --build
```

This will:
1. Start PostgreSQL
2. Build and start the FastAPI backend
3. Run database migrations automatically
4. Seed the database with demo data
5. Build and start the React frontend
6. Start Nginx reverse proxy

### 4. Access the application

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost |
| **API** | http://localhost/api/v1 |
| **Swagger UI** | http://localhost/docs |
| **ReDoc** | http://localhost/redoc |

---

## 🔑 Demo Credentials

> ⚠️ For development/demo purposes only. Change these in production.

| Field | Value |
|-------|-------|
| Email | `demo@example.com` |
| Password | `Demo@12345` |

---

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_DB` | Database name | `expense_tracker` |
| `POSTGRES_USER` | Database user | `app_user` |
| `POSTGRES_PASSWORD` | Database password | *(required)* |
| `SECRET_KEY` | JWT signing secret | *(required)* |
| `JWT_ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token lifetime | `7` |
| `APP_ENV` | Environment (`development`/`production`) | `development` |
| `DEBUG` | Debug mode | `true` |
| `VITE_API_BASE_URL` | Frontend API base URL | `http://localhost/api/v1` |

---

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# Build and start
docker compose up -d --build

# Stop all services
docker compose down

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend

# Restart services
docker compose restart
```

Or use the **Makefile** shortcuts:
```bash
make up          # Start services
make build       # Build and start
make down        # Stop services
make logs        # Stream logs
make migrate     # Run migrations
make seed        # Seed demo data
make test        # Run all tests
make shell-backend  # Open backend shell
```

---

## 🗄️ Database Migrations

```bash
# Apply all migrations
make migrate
# or:
docker compose exec backend alembic upgrade head

# Create a new migration
docker compose exec backend alembic revision --autogenerate -m "description"

# Rollback one migration
docker compose exec backend alembic downgrade -1

# View migration history
docker compose exec backend alembic history
```

---

## 🧪 Running Tests

### Backend Tests (Pytest)
```bash
make test-backend
# or:
docker compose exec backend pytest tests/ -v --tb=short
```

### Frontend Tests (Vitest)
```bash
make test-frontend
# or:
docker compose exec frontend npm run test
```

---

## 📡 API Documentation

The API documentation is available when the application is running:

- **Swagger UI**: http://localhost/docs
- **ReDoc**: http://localhost/redoc

### Key API Endpoints

```
POST   /api/v1/auth/register          Register new user
POST   /api/v1/auth/login             Login
POST   /api/v1/auth/refresh           Refresh access token
GET    /api/v1/auth/me                Get current user

GET    /api/v1/accounts               List accounts
POST   /api/v1/accounts               Create account
PUT    /api/v1/accounts/{id}          Update account
DELETE /api/v1/accounts/{id}          Delete account

GET    /api/v1/transactions           List transactions (paginated, filterable)
POST   /api/v1/transactions           Create transaction
PUT    /api/v1/transactions/{id}      Update transaction
DELETE /api/v1/transactions/{id}      Delete transaction

GET    /api/v1/transfers              List transfers
POST   /api/v1/transfers              Create transfer

GET    /api/v1/budgets                List budgets with spending
POST   /api/v1/budgets                Create budget

GET    /api/v1/dashboard/summary      Dashboard summary cards
GET    /api/v1/dashboard/charts/monthly  Monthly income/expense chart

GET    /api/v1/exports/transactions/csv    Export CSV
GET    /api/v1/exports/transactions/excel  Export Excel
GET    /api/v1/exports/transactions/pdf    Export PDF
```

---

## 🏭 Production Deployment

### Using Docker Compose production override
```bash
cp .env.example .env
# Edit .env with production values
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### Production checklist
- [ ] Change all default passwords in `.env`
- [ ] Generate a strong `SECRET_KEY` (minimum 32 chars)
- [ ] Set `DEBUG=false` and `APP_ENV=production`
- [ ] Configure TLS certificates in `nginx/ssl/`
- [ ] Update `BACKEND_CORS_ORIGINS` to your actual domain
- [ ] Review and tighten CORS settings
- [ ] Enable HTTPS-only (update nginx.prod.conf)
- [ ] Set up database backups
- [ ] Configure log rotation

---

## 🏗️ Architecture

### Request Flow
```
Browser
   ↓ HTTP
Nginx (port 80)
   ├── /api/* → FastAPI Backend (port 8000)
   │              ↓
   │           Service Layer (business logic)
   │              ↓
   │           Repository Layer (data access)
   │              ↓
   │           PostgreSQL (port 5432)
   │
   └── /* → React SPA (served by Nginx)
```

### Backend Architecture
```
Router (HTTP layer)
   ↓
Service (business logic)
   ↓
Repository (data access)
   ↓
SQLAlchemy (ORM)
   ↓
PostgreSQL
```

### Security Model
- JWT access tokens (30 min TTL) + refresh tokens (7 day TTL)
- bcrypt password hashing
- Every database query filters by `user_id` to prevent data leakage
- IDOR protection: ownership verified before any resource access
- SQL injection protection via SQLAlchemy parameterized queries

---

## 📊 Database Schema

```
users ──────────────── categories
  │                        │
  ├── accounts ─────── transactions
  │       │                │
  │   transfers         budgets
  │
  └── audit_logs
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
