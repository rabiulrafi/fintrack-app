import uuid

from sqlalchemy import Column, Date, ForeignKey, Numeric, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class Transfer(Base, TimestampMixin):
    __tablename__ = "transfers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    from_account_id = Column(
        UUID(as_uuid=True),
        ForeignKey("accounts.id", ondelete="RESTRICT"),
        nullable=False,
    )
    to_account_id = Column(
        UUID(as_uuid=True),
        ForeignKey("accounts.id", ondelete="RESTRICT"),
        nullable=False,
    )
    amount = Column(Numeric(precision=15, scale=2), nullable=False)
    currency = Column(String(10), default="BDT", nullable=False)
    transfer_date = Column(Date, nullable=False, index=True)
    description = Column(Text, nullable=True)

    user = relationship("User", back_populates="transfers")
    from_account = relationship(
        "Account",
        foreign_keys=[from_account_id],
        back_populates="outgoing_transfers",
    )
    to_account = relationship(
        "Account",
        foreign_keys=[to_account_id],
        back_populates="incoming_transfers",
    )
