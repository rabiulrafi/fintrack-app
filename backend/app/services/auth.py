from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user import UserResponse


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register(self, data: RegisterRequest) -> TokenResponse:
        existing = await self.user_repo.get_by_email(data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"success": False, "message": "Email already registered", "error_code": "EMAIL_TAKEN"},
            )
        user = User(
            full_name=data.full_name,
            email=data.email.lower(),
            password_hash=hash_password(data.password),
        )
        user = await self.user_repo.create(user)
        return self._create_tokens(user)

    async def login(self, data: LoginRequest) -> TokenResponse:
        email = data.email.lower().strip()
        user = await self.user_repo.get_by_email(email)

        # On-demand seed if demo account is requested but not yet in database
        if not user and email == "demo@example.com":
            from app.utils.seed import seed_data
            try:
                await seed_data(self.db)
                await self.db.commit()
                user = await self.user_repo.get_by_email(email)
            except Exception as e:
                import logging
                logging.getLogger(__name__).warning(f"On-demand seed error: {e}")

        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated",
            )
        return self._create_tokens(user)

    async def refresh(self, refresh_token: str) -> TokenResponse:
        try:
            payload = decode_token(refresh_token)
            if payload.get("type") != "refresh":
                raise ValueError("Not a refresh token")
            user_id = payload.get("sub")
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"success": False, "message": "Invalid refresh token", "error_code": "INVALID_REFRESH_TOKEN"},
            )
        from uuid import UUID
        user = await self.user_repo.get(UUID(user_id))
        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return self._create_tokens(user)

    def _create_tokens(self, user: User) -> TokenResponse:
        access_token = create_access_token({"sub": str(user.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserResponse.model_validate(user),
        )
