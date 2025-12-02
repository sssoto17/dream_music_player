from flask import Blueprint, request, make_response
from sqlalchemy import select
from uuid import uuid4

from ..db import db
from ..db.models import *

from ..auth.validation import *

app = Blueprint("lang",__name__)

app.route("/forms")
def form_languages():
    pass