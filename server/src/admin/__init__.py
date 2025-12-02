from os import getcwd
from flask import Blueprint, make_response
from requests import get
from json import dumps
from csv import DictReader
from io import StringIO

from ..utils import ic

app = Blueprint('admin', __name__, url_prefix='/admin')

sheet_key = "1FQLwxraGkM-SNsLfUbir3BfUnHRQZgXSHuvB0qF1zIg"
formSheet = f"https://docs.google.com/spreadsheets/d/{sheet_key}/export?format=csv&id={sheet_key}"

@app.route("/lang-support")
def get_languages():
    # Check if the admin is running this end-point, else show error
    try:
        res = get(url=formSheet)
        csv = StringIO(res.content.decode('utf-8'))
       
        data = {}

        # CREATE DICTIONARY
        reader = DictReader(csv)
        for row in reader:
            item = {
                    'english': row['English'],
                    'danish': row['Danish'],
            }
            
            data[row['Key']] = item

        # CONVERT TO JSON
        json_form = dumps(data, ensure_ascii=False, indent=4)
        path = f"{getcwd()}/languages/forms.json"
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(json_form)
        
        return make_response("Languages updated.", 200)
    except Exception as ex:
        ic(ex)
        return make_response(str(ex), 400)