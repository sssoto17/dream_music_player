from sqlalchemy import inspect
from sqlalchemy.orm import DeclarativeBase

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

class Base(DeclarativeBase):
    def to_dict(self):
        cols = inspect(self).mapper.column_attrs

        return {
            col.key: getattr(self, col.key)
            for col in cols
        }

db = SQLAlchemy(model_class=Base)
migrate = Migrate()