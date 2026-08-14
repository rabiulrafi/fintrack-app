from decimal import Decimal
from typing import List
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.account import Account
from app.repositories.account import AccountRepository
from app.schemas.account import AccountCreate, AccountUpdate, AccountResponse


class AccountService:
    def __init__(self, db: AsyncSession):
        self.repo = AccountRepository(db)

    async def create(self, user_id: UUID, data: AccountCreate) -> Account:
        account = Account(
            user_id=user_id,
            name=data.name,
            account_type=data.account_type,
            currency=data.currency,
            opening_balance=data.opening_balance,
            current_balance=data.opening_balance,
        )
        return await self.repo.create(account)

    async def list(self, user_id: UUID) -> List[Account]:
        return await self.repo.get_user_accounts(user_id)

    async def get(self, id: UUID, user_id: UUID) -> Account:
        account = await self.repo.get_by_user(id, user_id)
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Account not found", "error_code": "ACCOUNT_NOT_FOUND"},
            )
        return account

    async def update(self, id: UUID, user_id: UUID, data: AccountUpdate) -> Account:
        account = await self.get(id, user_id)
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(account, field, value)
        return account

    async def delete(self, id: UUID, user_id: UUID) -> None:
        account = await self.get(id, user_id)
        if await self.repo.has_transactions(id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "message": "Cannot delete account with existing transactions",
                    "error_code": "ACCOUNT_HAS_TRANSACTIONS",
                },
            )
        await self.repo.delete(account)

    async def adjust_balance(self, account: Account, amount: Decimal, is_credit: bool) -> None:
        if is_credit:
            account.current_balance = Decimal(str(account.current_balance)) + amount
        else:
            account.current_balance = Decimal(str(account.current_balance)) - amount
