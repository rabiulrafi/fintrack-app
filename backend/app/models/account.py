import enum
import uuid

from sqlalchemy import Boolean, Column, Enum, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class AccountType(str, enum.Enum):
    CASH = "CASH"
    BANK = "BANK"
    CREDIT_CARD = "CREDIT_CARD"
    MOBILE_WALLET = "MOBILE_WALLET"
    SAVINGS = "SAVINGS"
    OTHER = "OTHER"


class Account(Base, TimestampMixin):
    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name = Column(String(100), nullable=False)
    account_type = Column(Enum(AccountType), nullable=False)
    currency = Column(String(10), default="BDT", nullable=False)
    opening_balance = Column(Numeric(precision=15, scale=2), default=0, nullable=False)
    current_balance = Column(Numeric(precision=15, scale=2), default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    user = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account")
    outgoing_transfers = relationship(
        "Transfer",
        foreign_keys="Transfer.from_account_id",
        back_populates="from_account",
    )
    incoming_transfers = relationship(
        "Transfer",
        foreign_keys="Transfer.to_account_id",
        back_populates="to_account",
    )
