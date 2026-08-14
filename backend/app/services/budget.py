from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.budget import Budget
from app.repositories.budget import BudgetRepository
from app.repositories.transaction import TransactionRepository
from app.schemas.budget import BudgetCreate, BudgetUpdate, BudgetWithSpending


class BudgetService:
    def __init__(self, db: AsyncSession):
        self.repo = BudgetRepository(db)
        self.txn_repo = TransactionRepository(db)

    async def create(self, user_id: UUID, data: BudgetCreate) -> Budget:
        existing = await self.repo.get_by_category_month_year(
            user_id, data.category_id, data.month, data.year
        )
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "success": False,
                    "message": "Budget already exists for this category and month",
                    "error_code": "BUDGET_EXISTS",
                },
            )
        budget = Budget(
            user_id=user_id,
            category_id=data.category_id,
            month=data.month,
            year=data.year,
            amount=data.amount,
        )
        return await self.repo.create(budget)

    async def list_with_spending(
        self, user_id: UUID, month: Optional[int] = None, year: Optional[int] = None
    ) -> List[BudgetWithSpending]:
        budgets = await self.repo.get_user_budgets(user_id, month, year)
        result = []
        for budget in budgets:
            spent = await self.txn_repo.get_category_spending(
                user_id, budget.category_id, budget.month, budget.year
            )
            spent = Decimal(str(spent))
            budget_amount = Decimal(str(budget.amount))
            remaining = budget_amount - spent
            percentage = float((spent / budget_amount * 100)) if budget_amount > 0 else 0.0

            result.append(
                BudgetWithSpending(
                    id=budget.id,
                    user_id=budget.user_id,
                    category_id=budget.category_id,
                    month=budget.month,
                    year=budget.year,
                    amount=budget_amount,
                    category=budget.category,
                    spent=spent,
                    remaining=remaining,
                    percentage=round(percentage, 2),
                    created_at=budget.created_at,
                    updated_at=budget.updated_at,
                )
            )
        return result

    async def get(self, id: UUID, user_id: UUID) -> Budget:
        budget = await self.repo.get_with_category(id, user_id)
        if not budget:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Budget not found", "error_code": "BUDGET_NOT_FOUND"},
            )
        return budget

    async def update(self, id: UUID, user_id: UUID, data: BudgetUpdate) -> Budget:
        budget = await self.get(id, user_id)
        budget.amount = data.amount
        return budget

    async def delete(self, id: UUID, user_id: UUID) -> None:
        budget = await self.get(id, user_id)
        await self.repo.delete(budget)
