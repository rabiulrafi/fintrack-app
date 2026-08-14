from datetime import datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator

from app.models.account import AccountType


class AccountBase(BaseModel):
    name: str
    account_type: AccountType
    currency: str = "BDT"


class AccountCreate(AccountBase):
    opening_balance: Decimal = Decimal("0.00")

    @field_validator("opening_balance")
    @classmethod
    def validate_opening_balance(cls, v: Decimal) -> Decimal:
        if v < Decimal("0"):
            raise ValueError("Opening balance cannot be negative")
        return v


class AccountUpdate(BaseModel):
    name: Optional[str] = None
    account_type: Optional[AccountType] = None
    is_active: Optional[bool] = None


class AccountResponse(AccountBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    opening_balance: Decimal
    current_balance: Decimal
    is_active: bool
    created_at: datetime
    updated_at: datetime
