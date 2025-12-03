from os import getcwd
from flask import Blueprint, request, make_response
from json import load

app = Blueprint("lang",__name__,url_prefix="/lang")

@app.route("/<string:lang>")
def form_languages(lang = "en"):
    path = f"{getcwd()}/languages/forms.json"
    try:
        
        with open(path,"r", encoding="utf-8") as f:
            data = load(f)
        return make_response(data[lang], 200)
    except Exception as ex:
        return str(ex)