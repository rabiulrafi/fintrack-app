from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator

from app.schemas.account import AccountResponse


class TransferBase(BaseModel):
    from_account_id: UUID
    to_account_id: UUID
    amount: Decimal
    currency: str = "BDT"
    transfer_date: date
    description: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v: Decimal) -> Decimal:
        if v <= Decimal("0"):
            raise ValueError("Amount must be greater than zero")
        return v


class TransferCreate(TransferBase):
    pass


class TransferResponse(TransferBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    from_account: Optional[AccountResponse] = None
    to_account: Optional[AccountResponse] = None
