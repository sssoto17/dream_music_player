from os import getcwd
from flask import Blueprint, request, make_response
from requests import get
from json import dumps, load
from csv import DictReader
from io import StringIO

from sqlalchemy import select

from ..utils import ic
from ..db import db
from ..db.models import User, Blocked_User

app = Blueprint('admin', __name__, url_prefix='/admin')

sheet_key = "1FQLwxraGkM-SNsLfUbir3BfUnHRQZgXSHuvB0qF1zIg"
formSheet = f"https://docs.google.com/spreadsheets/d/{sheet_key}/export?format=csv&id={sheet_key}"

@app.route("/restrict/<int:id>")
def block_user(id):
    q = select(Blocked_User).where(Blocked_User.id == id)
    user = db.session.scalar(q)
    try:
        if not user:
            user = Blocked_User(user_id = id)
            db.session.add(user)

        db.session.commit()

        return make_response({"status": f"User updated."}, 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)

@app.route("/lang-support")
def get_languages():
    try:
        user_id = request.cookies["user_id"]
        
        q = select(User.role).where(User.id == user_id)
        user_role = db.session.scalar(q)

        if user_role != "admin": return Exception("Unauthorized: User does not have the necessary permissions to perform this action.", 401)

        res = get(url=formSheet)
        csv = StringIO(res.content.decode('utf-8'))
       
        data = {
            "en": {},
            "dk": {}
        }

        # CREATE DICTIONARY
        reader = DictReader(csv)

        for row in reader:
            data["en"][row["Key"]] = row["English"]
            data["dk"][row["Key"]] = row["Danish"]
        
        # CONVERT TO JSON
        json_form = dumps(data, ensure_ascii=False, indent=4)
        path = f"{getcwd()}/languages/forms.json"
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(json_form)
        
        return make_response({"message": "success_message_lang"}, 200)
    except Exception as ex:
        ic(ex)
        return make_response(str(ex), 400)