# Import all models so Alembic can auto-detect them
from app.models.user import User
from app.models.category import Category, CategoryType
from app.models.account import Account, AccountType
from app.models.transaction import Transaction, TransactionType
from app.models.transfer import Transfer
from app.models.budget import Budget
from app.models.audit_log import AuditLog

__all__ = [
    "User",
    "Category",
    "CategoryType",
    "Account",
    "AccountType",
    "Transaction",
    "TransactionType",
    "Transfer",
    "Budget",
    "AuditLog",
]
