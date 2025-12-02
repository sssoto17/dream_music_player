from flask import Blueprint

from . import users

app = Blueprint("api",__name__,url_prefix="/api")
app.register_blueprint(users.app)