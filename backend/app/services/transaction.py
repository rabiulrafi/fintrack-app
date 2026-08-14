import math
from decimal import Decimal
from typing import List, Tuple
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import Transaction, TransactionType
from app.repositories.account import AccountRepository
from app.repositories.category import CategoryRepository
from app.repositories.transaction import TransactionRepository
from app.schemas.common import PaginatedResponse
from app.schemas.transaction import TransactionCreate, TransactionFilter, TransactionResponse, TransactionUpdate


class TransactionService:
    def __init__(self, db: AsyncSession):
        self.repo = TransactionRepository(db)
        self.account_repo = AccountRepository(db)
        self.category_repo = CategoryRepository(db)

    async def create(self, user_id: UUID, data: TransactionCreate) -> Transaction:
        # Verify account ownership
        account = await self.account_repo.get_by_user(data.account_id, user_id)
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Account not found", "error_code": "ACCOUNT_NOT_FOUND"},
            )
        # Verify category ownership
        category = await self.category_repo.get_by_user(data.category_id, user_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Category not found", "error_code": "CATEGORY_NOT_FOUND"},
            )

        transaction = Transaction(
            user_id=user_id,
            account_id=data.account_id,
            category_id=data.category_id,
            transaction_type=data.transaction_type,
            amount=data.amount,
            currency=data.currency,
            transaction_date=data.transaction_date,
            description=data.description,
            notes=data.notes,
            reference_number=data.reference_number,
        )
        # Update account balance atomically
        if data.transaction_type == TransactionType.INCOME:
            account.current_balance = Decimal(str(account.current_balance)) + data.amount
        else:
            account.current_balance = Decimal(str(account.current_balance)) - data.amount

        return await self.repo.create(transaction)

    async def list(self, user_id: UUID, filters: TransactionFilter) -> PaginatedResponse[TransactionResponse]:
        items, total = await self.repo.get_filtered(user_id, filters)
        total_pages = math.ceil(total / filters.page_size) if total > 0 else 1
        return PaginatedResponse(
            items=[TransactionResponse.model_validate(t) for t in items],
            total=total,
            page=filters.page,
            page_size=filters.page_size,
            total_pages=total_pages,
        )

    async def get(self, id: UUID, user_id: UUID) -> Transaction:
        txn = await self.repo.get_with_relations(id, user_id)
        if not txn:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Transaction not found", "error_code": "TRANSACTION_NOT_FOUND"},
            )
        return txn

    async def update(self, id: UUID, user_id: UUID, data: TransactionUpdate) -> Transaction:
        txn = await self.repo.get_with_relations(id, user_id)
        if not txn:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Transaction not found", "error_code": "TRANSACTION_NOT_FOUND"},
            )

        old_amount = Decimal(str(txn.amount))
        old_type = txn.transaction_type
        old_account_id = txn.account_id

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(txn, field, value)

        # Reverse old balance effect on old account
        old_account = await self.account_repo.get(old_account_id)
        if old_account:
            if old_type == TransactionType.INCOME:
                old_account.current_balance = Decimal(str(old_account.current_balance)) - old_amount
            else:
                old_account.current_balance = Decimal(str(old_account.current_balance)) + old_amount

        # Apply new balance effect on (possibly new) account
        new_account_id = txn.account_id
        new_account = await self.account_repo.get(new_account_id)
        if new_account:
            if txn.transaction_type == TransactionType.INCOME:
                new_account.current_balance = Decimal(str(new_account.current_balance)) + Decimal(str(txn.amount))
            else:
                new_account.current_balance = Decimal(str(new_account.current_balance)) - Decimal(str(txn.amount))

        return txn

    async def delete(self, id: UUID, user_id: UUID) -> None:
        txn = await self.repo.get_with_relations(id, user_id)
        if not txn:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Transaction not found", "error_code": "TRANSACTION_NOT_FOUND"},
            )

        # Reverse balance effect
        account = await self.account_repo.get(txn.account_id)
        if account:
            if txn.transaction_type == TransactionType.INCOME:
                account.current_balance = Decimal(str(account.current_balance)) - Decimal(str(txn.amount))
            else:
                account.current_balance = Decimal(str(account.current_balance)) + Decimal(str(txn.amount))

        await self.repo.delete(txn)
