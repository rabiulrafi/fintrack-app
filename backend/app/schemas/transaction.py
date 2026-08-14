from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator

from app.models.transaction import TransactionType
from app.schemas.account import AccountResponse
from app.schemas.category import CategoryResponse


class TransactionBase(BaseModel):
    account_id: UUID
    category_id: UUID
    transaction_type: TransactionType
    amount: Decimal
    currency: str = "BDT"
    transaction_date: date
    description: Optional[str] = None
    notes: Optional[str] = None
    reference_number: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v: Decimal) -> Decimal:
        if v <= Decimal("0"):
            raise ValueError("Amount must be greater than zero")
        return v


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    account_id: Optional[UUID] = None
    category_id: Optional[UUID] = None
    transaction_type: Optional[TransactionType] = None
    amount: Optional[Decimal] = None
    currency: Optional[str] = None
    transaction_date: Optional[date] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    reference_number: Optional[str] = None

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        if v is not None and v <= Decimal("0"):
            raise ValueError("Amount must be greater than zero")
        return v


class TransactionResponse(TransactionBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    account: Optional[AccountResponse] = None
    category: Optional[CategoryResponse] = None


class TransactionFilter(BaseModel):
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    transaction_type: Optional[TransactionType] = None
    category_id: Optional[UUID] = None
    account_id: Optional[UUID] = None
    search: Optional[str] = None
    amount_min: Optional[Decimal] = None
    amount_max: Optional[Decimal] = None
    page: int = 1
    page_size: int = 20
    sort_by: str = "transaction_date"
    sort_order: str = "desc"
