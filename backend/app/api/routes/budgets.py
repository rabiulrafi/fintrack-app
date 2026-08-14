from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetWithSpending
from app.schemas.common import SuccessResponse
from app.services.budget import BudgetService

router = APIRouter(prefix="/budgets", tags=["Budgets"])


@router.get("", response_model=List[BudgetWithSpending])
async def list_budgets(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BudgetService(db)
    return await service.list_with_spending(current_user.id, month, year)


@router.post("", response_model=BudgetWithSpending, status_code=201)
async def create_budget(
    data: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BudgetService(db)
    budget = await service.create(current_user.id, data)
    budgets = await service.list_with_spending(current_user.id, budget.month, budget.year)
    return next(b for b in budgets if b.id == budget.id)


@router.get("/{budget_id}", response_model=BudgetWithSpending)
async def get_budget(
    budget_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BudgetService(db)
    budget = await service.get(budget_id, current_user.id)
    budgets = await service.list_with_spending(current_user.id, budget.month, budget.year)
    return next(b for b in budgets if b.id == budget.id)


@router.put("/{budget_id}", response_model=BudgetWithSpending)
async def update_budget(
    budget_id: UUID,
    data: BudgetUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BudgetService(db)
    budget = await service.update(budget_id, current_user.id, data)
    budgets = await service.list_with_spending(current_user.id, budget.month, budget.year)
    return next(b for b in budgets if b.id == budget.id)


@router.delete("/{budget_id}", response_model=SuccessResponse)
async def delete_budget(
    budget_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BudgetService(db)
    await service.delete(budget_id, current_user.id)
    return SuccessResponse(message="Budget deleted successfully")
