from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.transaction import TransactionType
from app.repositories.account import AccountRepository
from app.repositories.transaction import TransactionRepository
from app.schemas.dashboard import (
    AccountBalance,
    CategoryExpense,
    DashboardData,
    DashboardSummary,
    MonthlyChartData,
)
from app.schemas.transaction import TransactionResponse

MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]


class DashboardService:
    def __init__(self, db: AsyncSession):
        self.txn_repo = TransactionRepository(db)
        self.account_repo = AccountRepository(db)

    async def get_dashboard(
        self,
        user_id: UUID,
        date_from: Optional[date] = None,
        date_to: Optional[date] = None,
    ) -> DashboardData:
        now = datetime.now()
        month_start = date(now.year, now.month, 1)
        if now.month == 12:
            month_end = date(now.year + 1, 1, 1)
        else:
            month_end = date(now.year, now.month + 1, 1)

        # Summary
        total_income = Decimal(str(await self.txn_repo.get_total_by_type(
            user_id, TransactionType.INCOME, date_from, date_to
        )))
        total_expense = Decimal(str(await self.txn_repo.get_total_by_type(
            user_id, TransactionType.EXPENSE, date_from, date_to
        )))
        month_income = Decimal(str(await self.txn_repo.get_total_by_type(
            user_id, TransactionType.INCOME, month_start, month_end
        )))
        month_expense = Decimal(str(await self.txn_repo.get_total_by_type(
            user_id, TransactionType.EXPENSE, month_start, month_end
        )))

        # Account balances
        accounts = await self.account_repo.get_user_accounts(user_id, active_only=True)
        total_balance = sum(Decimal(str(a.current_balance)) for a in accounts)
        account_balances = [
            AccountBalance(
                account_id=str(a.id),
                account_name=a.name,
                account_type=a.account_type.value,
                balance=Decimal(str(a.current_balance)),
            )
            for a in accounts
        ]

        summary = DashboardSummary(
            total_balance=total_balance,
            total_income=total_income,
            total_expense=total_expense,
            net_savings=total_income - total_expense,
            current_month_income=month_income,
            current_month_expense=month_expense,
        )

        # Monthly chart — current year
        monthly_rows = await self.txn_repo.get_monthly_totals(user_id, now.year)
        monthly_dict: dict = {}
        for row in monthly_rows:
            m = int(row.month)
            if m not in monthly_dict:
                monthly_dict[m] = {"income": Decimal("0"), "expense": Decimal("0")}
            if row.transaction_type == TransactionType.INCOME:
                monthly_dict[m]["income"] = Decimal(str(row.total))
            else:
                monthly_dict[m]["expense"] = Decimal(str(row.total))

        monthly_chart = [
            MonthlyChartData(
                month=MONTH_NAMES[m - 1],
                income=monthly_dict.get(m, {}).get("income", Decimal("0")),
                expense=monthly_dict.get(m, {}).get("expense", Decimal("0")),
            )
            for m in range(1, 13)
        ]

        # Category expense breakdown
        cat_rows = await self.txn_repo.get_category_totals(
            user_id, TransactionType.EXPENSE, date_from, date_to
        )
        grand_total = sum(Decimal(str(r.total)) for r in cat_rows) or Decimal("1")
        category_expenses = [
            CategoryExpense(
                category_id=str(r.category_id),
                category_name=r.name,
                category_color=r.color,
                total=Decimal(str(r.total)),
                percentage=round(float(Decimal(str(r.total)) / grand_total * 100), 2),
            )
            for r in cat_rows
        ]

        # Recent transactions
        recent = await self.txn_repo.get_recent(user_id, limit=10)
        recent_txns = [TransactionResponse.model_validate(t) for t in recent]

        return DashboardData(
            summary=summary,
            monthly_chart=monthly_chart,
            category_expenses=category_expenses,
            account_balances=account_balances,
            recent_transactions=recent_txns,
        )
