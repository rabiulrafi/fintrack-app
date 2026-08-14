.PHONY: up down build logs restart shell-backend shell-frontend migrate seed test-backend test-frontend lint-backend lint-frontend

# ── Docker Compose ────────────────────────────────────────────────────────────
up:
	docker compose up -d

build:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f

restart:
	docker compose restart

clean:
	docker compose down -v --remove-orphans

# ── Database ──────────────────────────────────────────────────────────────────
migrate:
	docker compose exec backend alembic upgrade head

migrate-create:
	docker compose exec backend alembic revision --autogenerate -m "$(message)"

migrate-down:
	docker compose exec backend alembic downgrade -1

seed:
	docker compose exec backend python -m app.utils.seed

# ── Shell access ──────────────────────────────────────────────────────────────
shell-backend:
	docker compose exec backend bash

shell-frontend:
	docker compose exec frontend sh

shell-db:
	docker compose exec postgres psql -U ${POSTGRES_USER:-app_user} -d ${POSTGRES_DB:-expense_tracker}

# ── Testing ───────────────────────────────────────────────────────────────────
test-backend:
	docker compose exec backend pytest tests/ -v --tb=short

test-frontend:
	docker compose exec frontend npm run test

test:
	make test-backend test-frontend

# ── Linting ───────────────────────────────────────────────────────────────────
lint-backend:
	docker compose exec backend ruff check app/ tests/

lint-frontend:
	docker compose exec frontend npm run lint

# ── Production ────────────────────────────────────────────────────────────────
prod-up:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

prod-down:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

# ── Help ──────────────────────────────────────────────────────────────────────
help:
	@echo "Available commands:"
	@echo "  make up           - Start all services"
	@echo "  make build        - Build and start all services"
	@echo "  make down         - Stop all services"
	@echo "  make logs         - Stream logs from all services"
	@echo "  make migrate      - Run database migrations"
	@echo "  make seed         - Seed database with demo data"
	@echo "  make test         - Run all tests"
	@echo "  make shell-backend  - Open bash in backend container"
	@echo "  make prod-up      - Start production stack"
