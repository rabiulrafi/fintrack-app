from decimal import Decimal
from typing import List, Optional

from pydantic import BaseModel

from app.schemas.transaction import TransactionResponse


class DashboardSummary(BaseModel):
    total_balance: Decimal
    total_income: Decimal
    total_expense: Decimal
    net_savings: Decimal
    current_month_income: Decimal
    current_month_expense: Decimal


class MonthlyChartData(BaseModel):
    month: str
    income: Decimal
    expense: Decimal


class CategoryExpense(BaseModel):
    category_id: str
    category_name: str
    category_color: Optional[str]
    total: Decimal
    percentage: float


class AccountBalance(BaseModel):
    account_id: str
    account_name: str
    account_type: str
    balance: Decimal


class DashboardData(BaseModel):
    summary: DashboardSummary
    monthly_chart: List[MonthlyChartData]
    category_expenses: List[CategoryExpense]
    account_balances: List[AccountBalance]
    recent_transactions: List[TransactionResponse]
