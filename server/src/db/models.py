from . import db

from sqlalchemy import String, Enum, ForeignKey, ForeignKeyConstraint, PrimaryKeyConstraint, UniqueConstraint, inspect
from sqlalchemy.orm import Mapped, declared_attr, mapped_column, relationship

from typing import Optional, List, Literal, get_args
from datetime import datetime

# GLOBAL COLUMNS
class IDMixin:
    @declared_attr
    def id(cls) -> Mapped[int]:
        return mapped_column(primary_key=True, sort_order=-1)

class TimeStampMixin:
    @declared_attr
    def created_at(cls) -> Mapped[datetime]:
        return mapped_column(default=datetime.now(), sort_order=2)

class UserFKMixin:
    @declared_attr
    def user_id(cls) -> Mapped[int]:
        nullable = getattr(cls, "__user_fk_nullable__", False)
        ondelete = getattr(cls, "__user_fk_ondelete__", "CASCADE")
        
        return mapped_column(ForeignKey("users.id", ondelete=ondelete), nullable=nullable)
    
    @declared_attr
    def user(cls) -> Mapped["User"]:
        bp = getattr(cls, "__user_back_populates__", None)
        return relationship(back_populates=bp)
     
Roles = Literal["admin", "user"]

# TABLES
class User(db.Model, IDMixin, TimeStampMixin):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(25), unique=True)
    email: Mapped[str] = mapped_column(String(80), unique=True)
    password: Mapped[str] = mapped_column(String(180), nullable=False)
    first_name: Mapped[Optional[str]] = mapped_column(String(30))
    last_name: Mapped[Optional[str]] = mapped_column(String(30))
    bio: Mapped[Optional[str]] = mapped_column(String(500))
    verification_key: Mapped[Optional[str]] = mapped_column(String(32))
    verified_at: Mapped[Optional[datetime]] = mapped_column(default=None)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(default=None, sort_order=3)
    role: Mapped[Roles] = mapped_column(Enum(*get_args(Roles), name="role_enum",
        create_constraint=True,
        validate_strings=True,))

    token: Mapped["Refresh_Token"] = relationship(back_populates="user", cascade="all, delete", passive_deletes=True)
    sessions: Mapped[List["Session"]] = relationship(back_populates="user", cascade="all, delete", passive_deletes=True)
    avatar: Mapped["Avatar"] = relationship(back_populates="user", cascade="save-update, merge, delete, delete-orphan", single_parent=True)
    is_blocked: Mapped["Blocked_User"] = relationship(back_populates="user", cascade="all, delete", single_parent=True)
    
    def to_dict(self, auth:bool=False):
        cols = inspect(self).mapper.column_attrs
        user = { col.key: getattr(self, col.key) for col in cols }

        if not auth or not self.verification_key:
            user.pop("verification_key")
        if self.avatar:
            user["avatar"] = self.avatar.path
        if auth and self.token:
            user["refresh_token"] = self.token.refresh_token

        user.pop("password")
        user.pop("deleted_at")
          
        if not auth:
            user.pop("email")

        return user

class Refresh_Token(db.Model, IDMixin, UserFKMixin, TimeStampMixin):
    __tablename__ = "tokens"
    __user_back_populates__ = "token"

    refresh_token: Mapped[str] = mapped_column(String(160), unique=True)
    session: Mapped["Session"] = relationship(back_populates="token")

class Avatar(db.Model, IDMixin, UserFKMixin):
    __tablename__ = "user_avatars"
    __table_args__ = (
         UniqueConstraint("user_id"),
    )
    
    __user_back_populates__ = "avatar"
    __user_fk_nullable__ = True
    __user_fk_ondelete__ = "SET NULL"

    path: Mapped[str] = mapped_column(String(200))

class Session(db.Model, IDMixin, UserFKMixin, TimeStampMixin):
    __tablename__ = "sessions"
    __user_back_populates__ = "sessions"

    token_id: Mapped[int] = mapped_column(ForeignKey("tokens.id"))
    session_token: Mapped[str] = mapped_column(String(440), unique=True)
    expires_at: Mapped[datetime] = mapped_column(sort_order=2)
    
    token: Mapped["Refresh_Token"] = relationship(back_populates="session")

class Blocked_User(db.Model, IDMixin, UserFKMixin, TimeStampMixin):
    __tablename__ = "users_blocked"
    __table_args__ = (
         UniqueConstraint("user_id"),
    )
    __user_back_populates__ = "is_blocked"