from typing import List, Optional
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category, CategoryType
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, db: AsyncSession):
        self.repo = CategoryRepository(db)

    async def create(self, user_id: UUID, data: CategoryCreate) -> Category:
        category = Category(
            user_id=user_id,
            name=data.name,
            type=data.type,
            icon=data.icon,
            color=data.color,
        )
        return await self.repo.create(category)

    async def list(self, user_id: UUID, type_filter: Optional[CategoryType] = None) -> List[Category]:
        return await self.repo.get_user_categories(user_id, type_filter)

    async def get(self, id: UUID, user_id: UUID) -> Category:
        cat = await self.repo.get_by_user(id, user_id)
        if not cat:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Category not found", "error_code": "CATEGORY_NOT_FOUND"},
            )
        return cat

    async def update(self, id: UUID, user_id: UUID, data: CategoryUpdate) -> Category:
        cat = await self.get(id, user_id)
        for field, value in data.model_dump(exclude_unset=True).items():
            setattr(cat, field, value)
        return cat

    async def delete(self, id: UUID, user_id: UUID) -> None:
        cat = await self.get(id, user_id)
        if await self.repo.has_transactions(id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Cannot delete category with existing transactions",
                    "error_code": "CATEGORY_HAS_TRANSACTIONS",
                },
            )
        await self.repo.delete(cat)
