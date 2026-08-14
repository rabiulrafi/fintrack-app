"""
Seed script — creates demo user, default categories, and sample data.
Run: python -m app.utils.seed
Idempotent: safe to run multiple times.
"""
import asyncio
import logging
from datetime import date, timedelta
from decimal import Decimal
import random

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password

logger = logging.getLogger(__name__)

INCOME_CATEGORIES = [
    {"name": "Salary", "icon": "💼", "color": "#16a34a"},
    {"name": "Freelance", "icon": "💻", "color": "#0891b2"},
    {"name": "Business", "icon": "🏢", "color": "#7c3aed"},
    {"name": "Bonus", "icon": "🎁", "color": "#d97706"},
    {"name": "Interest", "icon": "🏦", "color": "#059669"},
    {"name": "Investment", "icon": "📈", "color": "#2563eb"},
    {"name": "Other Income", "icon": "💰", "color": "#6b7280"},
]

EXPENSE_CATEGORIES = [
    {"name": "Food & Dining", "icon": "🍔", "color": "#ef4444"},
    {"name": "Transportation", "icon": "🚗", "color": "#f97316"},
    {"name": "Rent", "icon": "🏠", "color": "#8b5cf6"},
    {"name": "Utilities", "icon": "💡", "color": "#eab308"},
    {"name": "Shopping", "icon": "🛍️", "color": "#ec4899"},
    {"name": "Healthcare", "icon": "🏥", "color": "#06b6d4"},
    {"name": "Education", "icon": "📚", "color": "#3b82f6"},
    {"name": "Entertainment", "icon": "🎬", "color": "#a855f7"},
    {"name": "Travel", "icon": "✈️", "color": "#14b8a6"},
    {"name": "Bills", "icon": "📄", "color": "#64748b"},
    {"name": "Insurance", "icon": "🛡️", "color": "#0284c7"},
    {"name": "Other", "icon": "📦", "color": "#9ca3af"},
]


async def seed():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    Session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with Session() as db:
        try:
            await seed_data(db)
            await db.commit()
            logger.info("Seed completed successfully.")
        except Exception as e:
            await db.rollback()
            logger.error(f"Seed failed: {e}")
        finally:
            await db.close()

    await engine.dispose()


async def seed_data(db: AsyncSession):
    from app.models.user import User
    from app.models.category import Category, CategoryType
    from app.models.account import Account, AccountType
    from app.models.transaction import Transaction, TransactionType

    # Check if demo user already exists
    result = await db.execute(select(User).where(User.email == settings.DEMO_USER_EMAIL))
    user = result.scalar_one_or_none()

    if user:
        logger.info("Demo user already exists, skipping seed.")
        return

    # Create demo user
    user = User(
        full_name="Demo User",
        email=settings.DEMO_USER_EMAIL,
        password_hash=hash_password(settings.DEMO_USER_PASSWORD),
        is_active=True,
    )
    db.add(user)
    await db.flush()

    # Create categories
    income_cats = []
    for cat_data in INCOME_CATEGORIES:
        cat = Category(
            user_id=user.id,
            name=cat_data["name"],
            type=CategoryType.INCOME,
            icon=cat_data["icon"],
            color=cat_data["color"],
            is_default=True,
        )
        db.add(cat)
        income_cats.append(cat)

    expense_cats = []
    for cat_data in EXPENSE_CATEGORIES:
        cat = Category(
            user_id=user.id,
            name=cat_data["name"],
            type=CategoryType.EXPENSE,
            icon=cat_data["icon"],
            color=cat_data["color"],
            is_default=True,
        )
        db.add(cat)
        expense_cats.append(cat)

    await db.flush()

    # Create accounts
    cash_account = Account(
        user_id=user.id,
        name="Cash",
        account_type=AccountType.CASH,
        currency="BDT",
        opening_balance=Decimal("20000.00"),
        current_balance=Decimal("20000.00"),
    )
    bank_account = Account(
        user_id=user.id,
        name="City Bank",
        account_type=AccountType.BANK,
        currency="BDT",
        opening_balance=Decimal("150000.00"),
        current_balance=Decimal("150000.00"),
    )
    db.add(cash_account)
    db.add(bank_account)
    await db.flush()

    # Create sample transactions for the last 6 months
    today = date.today()
    accounts = [cash_account, bank_account]

    sample_income = [
        ("Salary", Decimal("65000.00")),
        ("Salary", Decimal("65000.00")),
        ("Freelance", Decimal("25000.00")),
        ("Bonus", Decimal("15000.00")),
    ]
    sample_expenses = [
        ("Food & Dining", Decimal("8500.00")),
        ("Transportation", Decimal("4500.00")),
        ("Rent", Decimal("22000.00")),
        ("Utilities", Decimal("3500.00")),
        ("Shopping", Decimal("6000.00")),
        ("Entertainment", Decimal("2500.00")),
        ("Healthcare", Decimal("3000.00")),
        ("Bills", Decimal("2800.00")),
    ]

    income_cat_map = {c.name: c for c in income_cats}
    expense_cat_map = {c.name: c for c in expense_cats}

    for months_back in range(6):
        txn_date = today - timedelta(days=months_back * 30)

        # Income transactions
        for cat_name, amount in sample_income:
            cat = income_cat_map.get(cat_name)
            if not cat:
                continue
            account = bank_account
            txn = Transaction(
                user_id=user.id,
                account_id=account.id,
                category_id=cat.id,
                transaction_type=TransactionType.INCOME,
                amount=amount,
                currency="BDT",
                transaction_date=txn_date - timedelta(days=random.randint(0, 5)),
                description=f"{cat_name} payment",
            )
            db.add(txn)
            account.current_balance = Decimal(str(account.current_balance)) + amount

        # Expense transactions
        for cat_name, amount in sample_expenses:
            cat = expense_cat_map.get(cat_name)
            if not cat:
                continue
            account = random.choice(accounts)
            txn = Transaction(
                user_id=user.id,
                account_id=account.id,
                category_id=cat.id,
                transaction_type=TransactionType.EXPENSE,
                amount=amount,
                currency="BDT",
                transaction_date=txn_date - timedelta(days=random.randint(0, 20)),
                description=f"{cat_name} expense",
            )
            db.add(txn)
            account.current_balance = Decimal(str(account.current_balance)) - amount

    await db.flush()
    logger.info(f"Seeded demo user: {settings.DEMO_USER_EMAIL}")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(seed())
