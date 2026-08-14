import pytest


@pytest.mark.asyncio
async def test_dashboard_returns_data(client, auth_headers):
    response = await client.get("/api/v1/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert "monthly_chart" in data
    assert "category_expenses" in data
    assert "account_balances" in data
    assert "recent_transactions" in data


@pytest.mark.asyncio
async def test_dashboard_summary_fields(client, auth_headers):
    response = await client.get("/api/v1/dashboard", headers=auth_headers)
    summary = response.json()["summary"]
    assert "total_balance" in summary
    assert "total_income" in summary
    assert "total_expense" in summary
    assert "net_savings" in summary
    assert "current_month_income" in summary
    assert "current_month_expense" in summary


@pytest.mark.asyncio
async def test_dashboard_monthly_chart_has_12_months(client, auth_headers):
    response = await client.get("/api/v1/dashboard", headers=auth_headers)
    monthly_chart = response.json()["monthly_chart"]
    assert len(monthly_chart) == 12


@pytest.mark.asyncio
async def test_dashboard_with_date_filter(client, auth_headers):
    response = await client.get(
        "/api/v1/dashboard?date_from=2024-01-01&date_to=2024-12-31",
        headers=auth_headers,
    )
    assert response.status_code == 200
