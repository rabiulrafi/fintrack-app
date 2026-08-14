import asyncio
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.main import app
from app.core.database import Base, get_db
from app.core.security import hash_password
from app.models.user import User
from app.models.category import Category, CategoryType
from app.models.account import Account, AccountType

# Use SQLite for tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///./test.db"


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(test_engine):
    Session = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)
    async with Session() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def test_user(db_session):
    user = User(
        full_name="Test User",
        email="test@example.com",
        password_hash=hash_password("TestPass@123"),
    )
    db_session.add(user)
    await db_session.flush()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture
async def auth_headers(client, test_user):
    response = await client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "TestPass@123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest_asyncio.fixture
async def test_category(db_session, test_user):
    cat = Category(
        user_id=test_user.id,
        name="Test Food",
        type=CategoryType.EXPENSE,
        icon="🍔",
        color="#ef4444",
    )
    db_session.add(cat)
    await db_session.flush()
    await db_session.refresh(cat)
    return cat


@pytest_asyncio.fixture
async def test_income_category(db_session, test_user):
    cat = Category(
        user_id=test_user.id,
        name="Test Salary",
        type=CategoryType.INCOME,
        icon="💼",
        color="#16a34a",
    )
    db_session.add(cat)
    await db_session.flush()
    await db_session.refresh(cat)
    return cat


@pytest_asyncio.fixture
async def test_account(db_session, test_user):
    from decimal import Decimal
    account = Account(
        user_id=test_user.id,
        name="Test Bank",
        account_type=AccountType.BANK,
        currency="USD",
        opening_balance=Decimal("1000.00"),
        current_balance=Decimal("1000.00"),
    )
    db_session.add(account)
    await db_session.flush()
    await db_session.refresh(account)
    return account
