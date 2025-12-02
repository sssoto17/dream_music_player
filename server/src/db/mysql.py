from mysql.connector import connect,Error,errorcode
from ..utils import ic

config = {
    "user": "root",
    "password": "password",
    "host": "dmp_db",
    "database": "dmp",
    "raise_on_warnings": True
}

def connect():
    try:
        db = connect(**config)
        cursor = db.cursor(dictionary=True)
        return db, cursor
    except Error as ex:
        ic(ex)
        if ex.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            error = "Invalid username or password."
        elif ex.errno == errorcode.ER_BAD_DB_ERROR:
            error = "Database doesn't exist."
        else:
            error = ex
        raise Exception(error, 500)