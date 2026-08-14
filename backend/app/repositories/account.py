from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.account import Account
from app.repositories.base import BaseRepository


class AccountRepository(BaseRepository[Account]):
    def __init__(self, db: AsyncSession):
        super().__init__(Account, db)

    async def get_user_accounts(self, user_id: UUID, active_only: bool = False) -> List[Account]:
        query = select(Account).where(Account.user_id == user_id)
        if active_only:
            query = query.where(Account.is_active == True)
        query = query.order_by(Account.name)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def has_transactions(self, account_id: UUID) -> bool:
        from app.models.transaction import Transaction
        result = await self.db.execute(
            select(Transaction).where(Transaction.account_id == account_id).limit(1)
        )
        return result.scalar_one_or_none() is not None
