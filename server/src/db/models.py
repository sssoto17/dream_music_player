from . import db

from sqlalchemy import String, Enum, ForeignKey, UniqueConstraint, inspect
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
        return mapped_column(default=datetime.now, sort_order=2)

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
    followers_total: Mapped[int] = mapped_column(default=0)
    verification_key: Mapped[Optional[str]] = mapped_column(String(32))
    verified_at: Mapped[Optional[datetime]] = mapped_column(default=None)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(default=None, sort_order=3)
    role: Mapped[Roles] = mapped_column(Enum(*get_args(Roles), name="role_enum",
        create_constraint=True,
        validate_strings=True,))
    # is_blocked: Mapped[bool] = mapped_column(default=False)

    token: Mapped["Refresh_Token"] = relationship(back_populates="user", cascade="all, delete", passive_deletes=True)
    user_sessions: Mapped[List["User_Session"]] = relationship(back_populates="user", cascade="all, delete", passive_deletes=True)
    avatar: Mapped["Avatar"] = relationship(back_populates="user", cascade="save-update, merge, delete, delete-orphan", single_parent=True)
    likes: Mapped[List["Liked_Track"]] = relationship(back_populates="user", cascade="all, delete", passive_deletes=True)
    user_blocked: Mapped["Blocked_User"] = relationship(back_populates="user", cascade="all, delete", single_parent=True)
    following: Mapped[List["Follower"]] = relationship(foreign_keys="Follower.user_id",
        back_populates="follower",cascade="all, delete-orphan")
    followers: Mapped[List["Follower"]] = relationship(foreign_keys="Follower.user_following_id",
        back_populates="followed",cascade="all, delete-orphan")

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

    refresh_token: Mapped[str] = mapped_column(String(260), unique=True)
    user_session: Mapped["User_Session"] = relationship(back_populates="token",
    cascade="all, delete-orphan",
    uselist=False,
    passive_deletes=True)

class Avatar(db.Model, IDMixin, UserFKMixin):
    __tablename__ = "user_avatars"
    __table_args__ = (
         UniqueConstraint("user_id"),
    )
    
    __user_back_populates__ = "avatar"
    __user_fk_nullable__ = True
    __user_fk_ondelete__ = "SET NULL"

    path: Mapped[str] = mapped_column(String(200))

class User_Session(db.Model, IDMixin, UserFKMixin, TimeStampMixin):
    __tablename__ = "sessions"
    __user_back_populates__ = "user_sessions"

    token_id: Mapped[int] = mapped_column(ForeignKey("tokens.id"))
    access_token: Mapped[str] = mapped_column(String(440), unique=True)
    expires_at: Mapped[datetime] = mapped_column(sort_order=2)
    
    token: Mapped["Refresh_Token"] = relationship(back_populates="user_session")

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "refresh_token": self.token.refresh_token,
            "access_token": self.access_token,
            "expires_at": self.expires_at,
        }

class Blocked_User(db.Model, IDMixin, UserFKMixin, TimeStampMixin):
    __tablename__ = "users_blocked"
    __table_args__ = (
         UniqueConstraint("user_id"),
    )
    __user_back_populates__ = "user_blocked"

class Follower(db.Model, TimeStampMixin):
    __tablename__ = "user_following"

    user_id: Mapped[int] = mapped_column(
            ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        )
    user_following_id: Mapped[int] = mapped_column(
            ForeignKey("users.id", ondelete="CASCADE"),
            primary_key=True,
        )
    follower: Mapped["User"] = relationship(
            foreign_keys=[user_id],
            back_populates="following",
        )
    followed: Mapped["User"] = relationship(
            foreign_keys=[user_following_id],
            back_populates="followers",
        )

class Liked_Track(db.Model, IDMixin, UserFKMixin, TimeStampMixin):
    __tablename__ = "user_likes"
    __user_back_populates__ = "likes"

    track_id: Mapped[str] = mapped_column(String(25))