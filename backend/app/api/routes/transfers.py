from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.common import SuccessResponse
from app.schemas.transfer import TransferCreate, TransferResponse
from app.services.transfer import TransferService

router = APIRouter(prefix="/transfers", tags=["Transfers"])


@router.get("", response_model=List[TransferResponse])
async def list_transfers(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TransferService(db)
    return await service.list(current_user.id)


@router.post("", response_model=TransferResponse, status_code=201)
async def create_transfer(
    data: TransferCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TransferService(db)
    transfer = await service.create(current_user.id, data)
    return await service.get(transfer.id, current_user.id)


@router.get("/{transfer_id}", response_model=TransferResponse)
async def get_transfer(
    transfer_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TransferService(db)
    return await service.get(transfer_id, current_user.id)


@router.delete("/{transfer_id}", response_model=SuccessResponse)
async def delete_transfer(
    transfer_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TransferService(db)
    await service.delete(transfer_id, current_user.id)
    return SuccessResponse(message="Transfer deleted successfully")
