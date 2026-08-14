from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.budget import Budget
from app.repositories.base import BaseRepository


class BudgetRepository(BaseRepository[Budget]):
    def __init__(self, db: AsyncSession):
        super().__init__(Budget, db)

    async def get_user_budgets(
        self, user_id: UUID, month: Optional[int] = None, year: Optional[int] = None
    ) -> List[Budget]:
        query = (
            select(Budget)
            .options(selectinload(Budget.category))
            .where(Budget.user_id == user_id)
        )
        if month is not None:
            query = query.where(Budget.month == month)
        if year is not None:
            query = query.where(Budget.year == year)
        query = query.order_by(Budget.year.desc(), Budget.month.desc())
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_with_category(self, id: UUID, user_id: UUID) -> Optional[Budget]:
        result = await self.db.execute(
            select(Budget)
            .options(selectinload(Budget.category))
            .where(Budget.id == id, Budget.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_category_month_year(
        self, user_id: UUID, category_id: UUID, month: int, year: int
    ) -> Optional[Budget]:
        result = await self.db.execute(
            select(Budget).where(
                Budget.user_id == user_id,
                Budget.category_id == category_id,
                Budget.month == month,
                Budget.year == year,
            )
        )
        return result.scalar_one_or_none()
