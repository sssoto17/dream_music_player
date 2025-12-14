from os import getcwd, environ
from flask import Blueprint, request, make_response, render_template
from requests import get
from json import dumps, load
from csv import DictReader
from io import StringIO

from sqlalchemy import select

from ..utils import ic, send_email
from ..db import db
from ..db.models import User

app = Blueprint('admin', __name__, url_prefix='/admin')

sheet_key = "1FQLwxraGkM-SNsLfUbir3BfUnHRQZgXSHuvB0qF1zIg"
formSheet = f"https://docs.google.com/spreadsheets/d/{sheet_key}/export?format=csv&id={sheet_key}"

@app.route("/restrict/<int:id>")
def block_user(id):
    try:
        user_id = request.cookies["user_id"]
        
        q = select(User.role).where(User.id == user_id)
        user_role = db.session.scalar(q)

        if user_role != "admin": return Exception("Unauthorized: User does not have the necessary permissions to perform this action.", 401)

        q = select(User).where(User.id == id)
        user = db.session.scalar(q)

        user.is_blocked = not user.is_blocked

        db.session.commit()

        if user.is_blocked:
            message = "admin_blocked_user"
            # email_template = render_template("email/suspension.html")
            # send_email(user.email, "Attention: Your account has been suspended.", email_template)

        if not user.is_blocked:
            message = "admin_unblocked_user"

        # if not user:
        #     user = Blocked_User(user_id = id)
        #     db.session.add(user)

        # db.session.commit()

        return make_response({"message": message, "user": user.to_dict() }, 200)
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