from werkzeug.security import generate_password_hash
import re

min = 2

def validate_username(username):
    max = 25

    if len(username) < min: raise Exception({"username": f"Username must be at least {min} characters."})
    if len(username) > max: raise Exception({"username": f"Please limit username to {max} characters."})
    
    return username

def validate_email(email):
    REGEX = "^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$"
    if not re.match(REGEX, email): raise Exception({"email": "Please provide a valid email."})
    return email

def validate_name(name):
    max = 20
    REGEX = f"^.{{{min},{max}}}$"
    if not re.match(REGEX, name): raise Exception({"name": f"Please provide your full name."})
    return name

def validate_password(user_password, confirm_password):
    min = 6
    max = 50
    REGEX = f"^.{{{min},{max}}}$"
    
    if not re.match(REGEX, user_password):
        raise Exception({"password": "Invalid password."})
    
    if confirm_password != user_password:
        raise Exception({"password": "Please confirm your password."})
    
    return generate_password_hash(user_password, salt_length=25)
    
def validate_verification_key(key = None):
    if not key: raise Exception("Invalid key.")
    
    REGEX = "^[0-9a-f]{8}[0-9a-f]{4}4[0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$"

    if not re.match(REGEX, key.strip()): raise Exception("Invalid key.")
    
    return key