from typing import List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.transfer import Transfer
from app.repositories.base import BaseRepository


class TransferRepository(BaseRepository[Transfer]):
    def __init__(self, db: AsyncSession):
        super().__init__(Transfer, db)

    async def get_user_transfers(self, user_id: UUID) -> List[Transfer]:
        result = await self.db.execute(
            select(Transfer)
            .options(
                selectinload(Transfer.from_account),
                selectinload(Transfer.to_account),
            )
            .where(Transfer.user_id == user_id)
            .order_by(Transfer.transfer_date.desc())
        )
        return list(result.scalars().all())

    async def get_with_relations(self, id: UUID, user_id: UUID):
        result = await self.db.execute(
            select(Transfer)
            .options(
                selectinload(Transfer.from_account),
                selectinload(Transfer.to_account),
            )
            .where(Transfer.id == id, Transfer.user_id == user_id)
        )
        return result.scalar_one_or_none()
