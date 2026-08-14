from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category, CategoryType
from app.repositories.base import BaseRepository


class CategoryRepository(BaseRepository[Category]):
    def __init__(self, db: AsyncSession):
        super().__init__(Category, db)

    async def get_user_categories(
        self, user_id: UUID, type_filter: Optional[CategoryType] = None
    ) -> List[Category]:
        query = select(Category).where(Category.user_id == user_id)
        if type_filter:
            query = query.where(Category.type == type_filter)
        query = query.order_by(Category.name)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def has_transactions(self, category_id: UUID) -> bool:
        from app.models.transaction import Transaction
        result = await self.db.execute(
            select(Transaction).where(Transaction.category_id == category_id).limit(1)
        )
        return result.scalar_one_or_none() is not None

    async def get_by_name_and_user(self, name: str, user_id: UUID) -> Optional[Category]:
        result = await self.db.execute(
            select(Category).where(Category.name == name, Category.user_id == user_id)
        )
        return result.scalar_one_or_none()
