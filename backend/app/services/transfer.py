from decimal import Decimal
from typing import List
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transfer import Transfer
from app.repositories.account import AccountRepository
from app.repositories.transfer import TransferRepository
from app.schemas.transfer import TransferCreate


class TransferService:
    def __init__(self, db: AsyncSession):
        self.repo = TransferRepository(db)
        self.account_repo = AccountRepository(db)

    async def create(self, user_id: UUID, data: TransferCreate) -> Transfer:
        if data.from_account_id == data.to_account_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"success": False, "message": "Cannot transfer to the same account", "error_code": "SAME_ACCOUNT"},
            )
        from_account = await self.account_repo.get_by_user(data.from_account_id, user_id)
        if not from_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Source account not found", "error_code": "ACCOUNT_NOT_FOUND"},
            )
        to_account = await self.account_repo.get_by_user(data.to_account_id, user_id)
        if not to_account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Destination account not found", "error_code": "ACCOUNT_NOT_FOUND"},
            )

        transfer = Transfer(
            user_id=user_id,
            from_account_id=data.from_account_id,
            to_account_id=data.to_account_id,
            amount=data.amount,
            currency=data.currency,
            transfer_date=data.transfer_date,
            description=data.description,
        )

        # Adjust balances
        from_account.current_balance = Decimal(str(from_account.current_balance)) - data.amount
        to_account.current_balance = Decimal(str(to_account.current_balance)) + data.amount

        return await self.repo.create(transfer)

    async def list(self, user_id: UUID) -> List[Transfer]:
        return await self.repo.get_user_transfers(user_id)

    async def get(self, id: UUID, user_id: UUID) -> Transfer:
        transfer = await self.repo.get_with_relations(id, user_id)
        if not transfer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Transfer not found", "error_code": "TRANSFER_NOT_FOUND"},
            )
        return transfer

    async def delete(self, id: UUID, user_id: UUID) -> None:
        transfer = await self.repo.get_with_relations(id, user_id)
        if not transfer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Transfer not found", "error_code": "TRANSFER_NOT_FOUND"},
            )

        # Reverse balance effect
        from_account = await self.account_repo.get(transfer.from_account_id)
        to_account = await self.account_repo.get(transfer.to_account_id)
        if from_account:
            from_account.current_balance = Decimal(str(from_account.current_balance)) + Decimal(str(transfer.amount))
        if to_account:
            to_account.current_balance = Decimal(str(to_account.current_balance)) - Decimal(str(transfer.amount))

        await self.repo.delete(transfer)
