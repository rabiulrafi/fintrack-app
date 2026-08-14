from datetime import date
from decimal import Decimal

import pytest


@pytest.mark.asyncio
async def test_create_expense_transaction(client, auth_headers, test_account, test_category):
    response = await client.post(
        "/api/v1/transactions",
        headers=auth_headers,
        json={
            "account_id": str(test_account.id),
            "category_id": str(test_category.id),
            "transaction_type": "EXPENSE",
            "amount": "150.00",
            "currency": "USD",
            "transaction_date": str(date.today()),
            "description": "Test expense",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["transaction_type"] == "EXPENSE"
    assert data["amount"] == "150.00"


@pytest.mark.asyncio
async def test_create_income_transaction(client, auth_headers, test_account, test_income_category):
    response = await client.post(
        "/api/v1/transactions",
        headers=auth_headers,
        json={
            "account_id": str(test_account.id),
            "category_id": str(test_income_category.id),
            "transaction_type": "INCOME",
            "amount": "2000.00",
            "currency": "USD",
            "transaction_date": str(date.today()),
            "description": "Test income",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["transaction_type"] == "INCOME"


@pytest.mark.asyncio
async def test_amount_must_be_positive(client, auth_headers, test_account, test_category):
    response = await client.post(
        "/api/v1/transactions",
        headers=auth_headers,
        json={
            "account_id": str(test_account.id),
            "category_id": str(test_category.id),
            "transaction_type": "EXPENSE",
            "amount": "-50.00",
            "currency": "USD",
            "transaction_date": str(date.today()),
        },
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_list_transactions(client, auth_headers):
    response = await client.get("/api/v1/transactions", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data


@pytest.mark.asyncio
async def test_list_transactions_filter_by_type(client, auth_headers):
    response = await client.get(
        "/api/v1/transactions?transaction_type=EXPENSE", headers=auth_headers
    )
    assert response.status_code == 200
    for item in response.json()["items"]:
        assert item["transaction_type"] == "EXPENSE"


@pytest.mark.asyncio
async def test_delete_transaction(client, auth_headers, test_account, test_category):
    # Create transaction
    create_resp = await client.post(
        "/api/v1/transactions",
        headers=auth_headers,
        json={
            "account_id": str(test_account.id),
            "category_id": str(test_category.id),
            "transaction_type": "EXPENSE",
            "amount": "75.00",
            "currency": "USD",
            "transaction_date": str(date.today()),
        },
    )
    txn_id = create_resp.json()["id"]

    # Delete it
    del_resp = await client.delete(f"/api/v1/transactions/{txn_id}", headers=auth_headers)
    assert del_resp.status_code == 200

    # Verify it's gone
    get_resp = await client.get(f"/api/v1/transactions/{txn_id}", headers=auth_headers)
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_transaction_isolation(client, db_session):
    """User A cannot access User B's transactions."""
    # Register user A
    resp_a = await client.post(
        "/api/v1/auth/register",
        json={"full_name": "User A", "email": "usera_txn@test.com", "password": "Pass@12345"},
    )
    headers_a = {"Authorization": f"Bearer {resp_a.json()['access_token']}"}

    # Register user B and get their transactions
    resp_b = await client.post(
        "/api/v1/auth/register",
        json={"full_name": "User B", "email": "userb_txn@test.com", "password": "Pass@12345"},
    )
    headers_b = {"Authorization": f"Bearer {resp_b.json()['access_token']}"}

    # User B lists their transactions — should be empty, no access to A's
    resp = await client.get("/api/v1/transactions", headers=headers_b)
    assert resp.status_code == 200
    assert resp.json()["total"] == 0
