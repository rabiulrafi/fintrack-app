from datetime import date
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.transaction import TransactionType
from app.models.user import User
from app.schemas.transaction import TransactionFilter
from app.services.export import ExportService

router = APIRouter(prefix="/exports", tags=["Exports"])


def get_filters(
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    transaction_type: Optional[TransactionType] = Query(None),
    category_id: Optional[UUID] = Query(None),
    account_id: Optional[UUID] = Query(None),
    search: Optional[str] = Query(None),
) -> TransactionFilter:
    return TransactionFilter(
        date_from=date_from,
        date_to=date_to,
        transaction_type=transaction_type,
        category_id=category_id,
        account_id=account_id,
        search=search,
        page=1,
        page_size=10000,
    )


@router.get("/transactions/csv")
async def export_csv(
    filters: TransactionFilter = Depends(get_filters),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ExportService(db)
    transactions = await service.get_transactions(current_user.id, filters)
    content = service.to_csv(transactions)
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=transactions.csv"},
    )


@router.get("/transactions/excel")
async def export_excel(
    filters: TransactionFilter = Depends(get_filters),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ExportService(db)
    transactions = await service.get_transactions(current_user.id, filters)
    content = service.to_excel(transactions)
    return Response(
        content=content,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=transactions.xlsx"},
    )


@router.get("/transactions/pdf")
async def export_pdf(
    filters: TransactionFilter = Depends(get_filters),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ExportService(db)
    transactions = await service.get_transactions(current_user.id, filters)
    content = service.to_pdf(transactions)
    return Response(
        content=content,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=transactions.pdf"},
    )
