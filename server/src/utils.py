from icecream import ic as icecream
from base64 import b64encode
from datetime import datetime, timedelta

def ic(log):
    icecream.configureOutput(prefix=f'LOG || ', includeContext=True)
    return icecream(log)

def b64(str):
    auth_str = str.encode("ascii")
    auth_b64 = b64encode(auth_str)
    return auth_b64.decode("ascii")

def expires_at(s):
    now = datetime.now()
    expiration = now + timedelta(0,s)
    return expiration