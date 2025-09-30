from flask import Blueprint, jsonify, request, session
from marshmallow import ValidationError
from models.schema.registrationForm import RegistrationForm
from models.schema.loginForm import LoginForm
from services.Functions import Insert, Select
import bcrypt

auth = Blueprint("auth", __name__)

selector = Select.Select()
insertor = Insert.Insert()

# ========================== 
# REGISTER
# ==========
@auth.route("/register", methods = ["POST"])
def register():
    schema = RegistrationForm()

    try:
        data = schema.load(request.json)
    except ValidationError as ve: 
        return jsonify({"errors": ve.messages}), 400
    
    hashed_pw = bcrypt.hashpw(data["user_password"].encode("utf-8"), bcrypt.gensalt())
    data["user_password"] = hashed_pw.decode("utf-8") 

    insertor.table("users").values(data).execute()

    return jsonify({"success": True, "message" : "Successfully registered!"})

# ========================== 
# LOG IN
# ==========
@auth.route("/login", methods = ["POST"])
def login():
    schema = LoginForm()

    try:
        data = schema.load(request.json)
        auth_username = data["user_name"]
        auth_password = data["user_password"]
        print(auth_username)

    except ValidationError as ve: 
        return jsonify({"errors": ve.messages}), 400
    
    exist_auth = selector.table("users")\
                                    .search(tag="user_name", key=auth_username)\
                                    .execute()\
                                    .retDict()
    print("DEBUG EXIST_AUTH:", exist_auth)
    if not exist_auth:
        return jsonify({"success" : False, "message": "Account can not be found."}), 401
    
    valid_auth = exist_auth[0]

    stored_hash = valid_auth["user_password"].encode("utf-8")
    if not bcrypt.checkpw(auth_password.encode("utf-8"), stored_hash):
        return jsonify({"success": False, "message": "Incorrect Password."}), 401

    session["user"] = {"user_name": valid_auth["user_name"]}
    return jsonify({"success": True, "message": "Successfully Logged In!"}), 200


# ========================== 
# LOG OUT
# ==========
@auth.route("/api/logout", methods = ["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"success": True, "message": "Logged out"})


# ========================== 
# CURRENTLY LOGGED IN
# ==========
@auth.route("/api/me", methods=["GET"])
def me():
    user = session.get("user")
    if user:
        return jsonify({"isLoggedIn": True, "user": user})
    return jsonify({"isLoggedIn": False})