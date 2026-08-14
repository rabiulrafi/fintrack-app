import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine
from app.api.routes import auth, accounts, categories, transactions, transfers, budgets, dashboard, exports

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


from app.core.database import engine, Base, AsyncSessionLocal
from app.models import *  # noqa: F401, F403
from app.utils.seed import seed_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting FinTrack API...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    try:
        async with AsyncSessionLocal() as session:
            await seed_data(session)
            await session.commit()
    except Exception as e:
        logger.warning(f"Startup seed notice: {e}")

    yield
    logger.info("Shutting down FinTrack API...")
    await engine.dispose()


app = FastAPI(
    title="FinTrack API",
    description="Income & Expense Tracker — Production-ready personal finance API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
PREFIX = "/api/v1"
app.include_router(auth.router, prefix=PREFIX)
app.include_router(accounts.router, prefix=PREFIX)
app.include_router(categories.router, prefix=PREFIX)
app.include_router(transactions.router, prefix=PREFIX)
app.include_router(transfers.router, prefix=PREFIX)
app.include_router(budgets.router, prefix=PREFIX)
app.include_router(dashboard.router, prefix=PREFIX)
app.include_router(exports.router, prefix=PREFIX)


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "version": "1.0.0", "env": settings.APP_ENV}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An internal server error occurred",
            "error_code": "INTERNAL_SERVER_ERROR",
        },
    )
