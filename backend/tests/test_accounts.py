import pytest


@pytest.mark.asyncio
async def test_create_account(client, auth_headers):
    response = await client.post(
        "/api/v1/accounts",
        headers=auth_headers,
        json={
            "name": "Savings",
            "account_type": "SAVINGS",
            "currency": "USD",
            "opening_balance": "5000.00",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Savings"
    assert data["current_balance"] == "5000.00"


@pytest.mark.asyncio
async def test_list_accounts(client, auth_headers, test_account):
    response = await client.get("/api/v1/accounts", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_update_account(client, auth_headers, test_account):
    response = await client.put(
        f"/api/v1/accounts/{test_account.id}",
        headers=auth_headers,
        json={"name": "Updated Bank"},
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Bank"


@pytest.mark.asyncio
async def test_cannot_delete_account_of_other_user(client, test_account):
    # Register a different user
    resp = await client.post(
        "/api/v1/auth/register",
        json={"full_name": "Other User", "email": "other_acct@test.com", "password": "Pass@12345"},
    )
    other_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

    # Try to delete original test_account — should return 404 (ownership check)
    response = await client.delete(
        f"/api/v1/accounts/{test_account.id}", headers=other_headers
    )
    assert response.status_code == 404
