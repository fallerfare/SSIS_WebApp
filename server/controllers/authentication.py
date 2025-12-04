from flask import Blueprint, jsonify, request, session
from marshmallow import ValidationError
from psycopg2 import IntegrityError
from models.schema.registrationForm import RegistrationForm
from models.schema.loginForm import LoginForm
from services.Functions import Insert, Select
import bcrypt

auth = Blueprint("auth", __name__, url_prefix="/api/auth")

selector = Select.Select()
insertor = Insert.Insert()

# ========================== 
# REGISTER
# ==========
@auth.route("/register", methods = ["POST"])
def register():
    schema = RegistrationForm()
    data = request.json

    if not data:
        return jsonify({"error": "No data proided"}), 404

    try:
        validated_data = schema.load(data)
    except ValidationError as ve: 
        return jsonify({
            "success": False,
            "message": "Invalid input.",
            "errors": ve.messages
        }), 400
    
    hashed_pw = bcrypt.hashpw(data["user_password"].encode("utf-8"), bcrypt.gensalt())
    validated_data["user_password"] = hashed_pw.decode("utf-8") 

    try:
        insertor.table("users").values(validated_data).execute()        
    except IntegrityError as ie:
        err_msg =  str(ie).split('\n')[0]
        user_name = validated_data.get('user_name')
        user_email = validated_data.get('user_email')

        if "users_pkey" in err_msg:
            err_msg = f"User already exists'"
        elif "unique_user_name" in err_msg:
            err_msg = f"User name '{user_name}' already exists."
        elif "unique_user_email" in err_msg:
            err_msg = f"Email '{user_email}' already exists."

        return jsonify({
            "success": False,
            "message": err_msg
        }), 409


    return jsonify({
        "success": True, 
        "message" : "Successfully registered!"
    }), 200

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

    except ValidationError as ve:
        return jsonify({
            "success": False,
            "message": "Invalid input.",
            "errors": ve.messages
        }), 400

    
    auth = selector.table("users")
    auth.searchquery = f" WHERE user_name = '{auth_username}'"

    exist_auth = auth.execute().retDict()  

    if not exist_auth:
        return jsonify({
            "success": False,
            "message": "Account cannot be found."
        }), 401

    
    valid_auth = exist_auth[0]

    stored_hash = valid_auth["user_password"].encode("utf-8")
    if not bcrypt.checkpw(auth_password.encode("utf-8"), stored_hash):
        return jsonify({
            "success": False,
            "message": "Incorrect password."
        }), 401

    session["user"] = valid_auth
    return jsonify({
        "success": True, 
        "message": "Successfully Logged In!"
    }), 200


# ========================== 
# LOG OUT
# ==========
@auth.route("/logout", methods = ["POST"])
def logout():
    session.clear()
    return jsonify({
        "success": True, 
        "message": "Successfully Logged out"
    }), 200


# ========================== 
# CURRENTLY LOGGED IN
# ==========
@auth.route("/me", methods=["GET"])
def me():
    try:
        session_user = session.get("user")
        if session_user is None:
            return jsonify({"isLoggedIn": False, "user": None}), 200

        user_id = session_user["id_number"]

        user = selector.table("users").search(tag="id_number", key=user_id).execute().retDict()
        if not user:
            return jsonify({"isLoggedIn": False, "user": None}), 200

        user_data = dict(user[0])
        user_data.pop("user_password", None)
        session["user"] = user_data

        return jsonify({"isLoggedIn": True, "user": user_data}), 200

    except Exception as e:
        return jsonify({"isLoggedIn": False, "error": str(e)}), 500

