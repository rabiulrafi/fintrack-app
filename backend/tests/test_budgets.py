import pytest
from datetime import date


@pytest.mark.asyncio
async def test_create_budget(client, auth_headers, test_category):
    today = date.today()
    response = await client.post(
        "/api/v1/budgets",
        headers=auth_headers,
        json={
            "category_id": str(test_category.id),
            "month": today.month,
            "year": today.year,
            "amount": "500.00",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == "500.00"
    assert "spent" in data
    assert "remaining" in data
    assert "percentage" in data


@pytest.mark.asyncio
async def test_list_budgets(client, auth_headers):
    response = await client.get("/api/v1/budgets", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_duplicate_budget_rejected(client, auth_headers, test_category):
    today = date.today()
    payload = {
        "category_id": str(test_category.id),
        "month": today.month,
        "year": today.year,
        "amount": "300.00",
    }
    await client.post("/api/v1/budgets", headers=auth_headers, json=payload)
    response = await client.post("/api/v1/budgets", headers=auth_headers, json=payload)
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_delete_budget(client, auth_headers, test_category):
    today = date.today()
    create_resp = await client.post(
        "/api/v1/budgets",
        headers=auth_headers,
        json={
            "category_id": str(test_category.id),
            "month": (today.month % 12) + 1,
            "year": today.year,
            "amount": "200.00",
        },
    )
    budget_id = create_resp.json()["id"]
    del_resp = await client.delete(f"/api/v1/budgets/{budget_id}", headers=auth_headers)
    assert del_resp.status_code == 200
