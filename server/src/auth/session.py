from flask import Blueprint, request

from sqlalchemy import select

from ..db import db
# from ..db.models import Session
from ..utils import ic

app = Blueprint('session', __name__)

# @app.route("/sessions/<int:id>", methods=["GET", "POST"])
# def create_session():
#     if request.method == "POST":
#         session = Session()


#         # session id: access_token
#         # token fk: refresh_token
#         # user fk: user id

#         try:
#             pass
#         except Exception as ex:
#             ic(ex)
#             pass

# @app.route("/sessions/<int:id>")
# def get_session():
#     pass