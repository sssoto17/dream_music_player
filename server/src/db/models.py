from . import db

from sqlalchemy import String, ForeignKey, inspect
from sqlalchemy.orm import Mapped, mapped_column, relationship

from typing import Optional, List
from datetime import datetime

# GLOBAL COLUMNS
class IDMixin:
     id: Mapped[int] = mapped_column(primary_key=True, sort_order=-1)

class TimeStampMixin:
    created_at: Mapped[datetime] = mapped_column(default=datetime.now(), sort_order=2)

class UserFKMixin:
     user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
     

# TABLES
class User(db.Model, IDMixin, TimeStampMixin):
     __tablename__ = "users"

     username: Mapped[str] = mapped_column(String(25), unique=True)
     email: Mapped[str] = mapped_column(String(80), unique=True)
     password: Mapped[str] = mapped_column(String(180), nullable=False)
     first_name: Mapped[Optional[str]] = mapped_column(String(30))
     last_name: Mapped[Optional[str]] = mapped_column(String(30))
     verification_key: Mapped[Optional[str]] = mapped_column(String(32))
     verified_at: Mapped[Optional[datetime]] = mapped_column(default=None)
     deleted_at: Mapped[Optional[datetime]] = mapped_column(default=None, sort_order=3)

     token: Mapped["Refresh_Token"] = relationship(back_populates="user", cascade="all, delete", passive_deletes=True)
     avatar: Mapped["Avatar"] = relationship(back_populates="user", cascade="all, delete", passive_deletes=True)

     def to_dict(self, auth:bool=False):
          cols = inspect(self).mapper.column_attrs
          user = { col.key: getattr(self, col.key) for col in cols }

          if self.avatar:
               user["avatar"] = self.avatar.path
          if auth and self.token:
               user["refresh_token"] = self.token.refresh_token

          user.pop("password")
          user.pop("verification_key")
          user.pop("deleted_at")
          
          if not auth:
               user.pop("email")

          return user

class Refresh_Token(db.Model, IDMixin, UserFKMixin, TimeStampMixin):
     __tablename__ = "tokens"

     refresh_token: Mapped[str] = mapped_column(String(160), unique=True)
     user: Mapped["User"] = relationship(back_populates="token")

class Avatar(db.Model, IDMixin, UserFKMixin):
     __tablename__ = "user_avatars"

     path: Mapped[str] = mapped_column(String(200))
     user: Mapped["User"] = relationship(back_populates="avatar")

# class Playlist(db.Model, IDMixin):
#      pass