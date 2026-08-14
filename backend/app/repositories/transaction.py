import math
from typing import List, Tuple
from uuid import UUID

from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.account import Account
from app.models.category import Category
from app.models.transaction import Transaction, TransactionType
from app.repositories.base import BaseRepository
from app.schemas.transaction import TransactionFilter


class TransactionRepository(BaseRepository[Transaction]):
    def __init__(self, db: AsyncSession):
        super().__init__(Transaction, db)

    async def get_with_relations(self, id: UUID, user_id: UUID):
        result = await self.db.execute(
            select(Transaction)
            .options(selectinload(Transaction.account), selectinload(Transaction.category))
            .where(Transaction.id == id, Transaction.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_filtered(
        self, user_id: UUID, filters: TransactionFilter
    ) -> Tuple[List[Transaction], int]:
        conditions = [Transaction.user_id == user_id]

        if filters.date_from:
            conditions.append(Transaction.transaction_date >= filters.date_from)
        if filters.date_to:
            conditions.append(Transaction.transaction_date <= filters.date_to)
        if filters.transaction_type:
            conditions.append(Transaction.transaction_type == filters.transaction_type)
        if filters.category_id:
            conditions.append(Transaction.category_id == filters.category_id)
        if filters.account_id:
            conditions.append(Transaction.account_id == filters.account_id)
        if filters.amount_min is not None:
            conditions.append(Transaction.amount >= filters.amount_min)
        if filters.amount_max is not None:
            conditions.append(Transaction.amount <= filters.amount_max)
        if filters.search:
            search_term = f"%{filters.search}%"
            conditions.append(
                or_(
                    Transaction.description.ilike(search_term),
                    Transaction.notes.ilike(search_term),
                    Transaction.reference_number.ilike(search_term),
                )
            )

        where_clause = and_(*conditions)

        # Count total
        count_result = await self.db.execute(
            select(func.count()).select_from(Transaction).where(where_clause)
        )
        total = count_result.scalar() or 0

        # Sorting
        sort_col = getattr(Transaction, filters.sort_by, Transaction.transaction_date)
        order = sort_col.desc() if filters.sort_order == "desc" else sort_col.asc()

        # Paginated results
        offset = (filters.page - 1) * filters.page_size
        result = await self.db.execute(
            select(Transaction)
            .options(selectinload(Transaction.account), selectinload(Transaction.category))
            .where(where_clause)
            .order_by(order)
            .offset(offset)
            .limit(filters.page_size)
        )
        items = list(result.scalars().all())

        return items, total

    async def get_recent(self, user_id: UUID, limit: int = 10) -> List[Transaction]:
        result = await self.db.execute(
            select(Transaction)
            .options(selectinload(Transaction.account), selectinload(Transaction.category))
            .where(Transaction.user_id == user_id)
            .order_by(Transaction.transaction_date.desc(), Transaction.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_total_by_type(
        self,
        user_id: UUID,
        transaction_type: TransactionType,
        date_from=None,
        date_to=None,
    ):
        from decimal import Decimal
        conditions = [
            Transaction.user_id == user_id,
            Transaction.transaction_type == transaction_type,
        ]
        if date_from:
            conditions.append(Transaction.transaction_date >= date_from)
        if date_to:
            conditions.append(Transaction.transaction_date <= date_to)

        result = await self.db.execute(
            select(func.coalesce(func.sum(Transaction.amount), 0)).where(and_(*conditions))
        )
        return result.scalar() or Decimal("0")

    async def get_monthly_totals(self, user_id: UUID, year: int):
        """Returns monthly income and expense totals for a given year."""
        result = await self.db.execute(
            select(
                func.extract("month", Transaction.transaction_date).label("month"),
                Transaction.transaction_type,
                func.sum(Transaction.amount).label("total"),
            )
            .where(
                Transaction.user_id == user_id,
                func.extract("year", Transaction.transaction_date) == year,
            )
            .group_by(
                func.extract("month", Transaction.transaction_date),
                Transaction.transaction_type,
            )
            .order_by(func.extract("month", Transaction.transaction_date))
        )
        return result.all()

    async def get_category_totals(
        self,
        user_id: UUID,
        transaction_type: TransactionType,
        date_from=None,
        date_to=None,
    ):
        conditions = [
            Transaction.user_id == user_id,
            Transaction.transaction_type == transaction_type,
        ]
        if date_from:
            conditions.append(Transaction.transaction_date >= date_from)
        if date_to:
            conditions.append(Transaction.transaction_date <= date_to)

        result = await self.db.execute(
            select(
                Transaction.category_id,
                Category.name,
                Category.color,
                func.sum(Transaction.amount).label("total"),
            )
            .join(Category, Transaction.category_id == Category.id)
            .where(and_(*conditions))
            .group_by(Transaction.category_id, Category.name, Category.color)
            .order_by(func.sum(Transaction.amount).desc())
        )
        return result.all()

    async def get_category_spending(self, user_id: UUID, category_id: UUID, month: int, year: int):
        from decimal import Decimal
        result = await self.db.execute(
            select(func.coalesce(func.sum(Transaction.amount), 0))
            .where(
                Transaction.user_id == user_id,
                Transaction.category_id == category_id,
                Transaction.transaction_type == TransactionType.EXPENSE,
                func.extract("month", Transaction.transaction_date) == month,
                func.extract("year", Transaction.transaction_date) == year,
            )
        )
        return result.scalar() or Decimal("0")

    async def get_all_for_export(self, user_id: UUID, filters: TransactionFilter) -> List[Transaction]:
        """Get all transactions for export (no pagination)."""
        conditions = [Transaction.user_id == user_id]
        if filters.date_from:
            conditions.append(Transaction.transaction_date >= filters.date_from)
        if filters.date_to:
            conditions.append(Transaction.transaction_date <= filters.date_to)
        if filters.transaction_type:
            conditions.append(Transaction.transaction_type == filters.transaction_type)
        if filters.category_id:
            conditions.append(Transaction.category_id == filters.category_id)
        if filters.account_id:
            conditions.append(Transaction.account_id == filters.account_id)
        if filters.search:
            search_term = f"%{filters.search}%"
            conditions.append(or_(
                Transaction.description.ilike(search_term),
                Transaction.notes.ilike(search_term),
            ))

        result = await self.db.execute(
            select(Transaction)
            .options(selectinload(Transaction.account), selectinload(Transaction.category))
            .where(and_(*conditions))
            .order_by(Transaction.transaction_date.desc())
        )
        return list(result.scalars().all())
