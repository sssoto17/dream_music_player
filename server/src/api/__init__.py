from flask import Blueprint

from . import users, languages
from .languages import app as languages

app = Blueprint("api",__name__,url_prefix="/api")
app.register_blueprint(users.app)
app.register_blueprint(languages)