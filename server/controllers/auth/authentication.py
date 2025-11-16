import datetime
from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
import bcrypt
from marshmallow import ValidationError

from models.schema.registrationForm import RegistrationForm
from models.schema.loginForm import LoginForm
from services.Functions import Insert, Select
from controllers.auth.viewUser import view_user_nameemail

auth = Blueprint("auth", __name__, url_prefix="/api/auth")

selector = Select.Select()
insertor = Insert.Insert()

# ============
# REGISTER
# =======
@auth.route("/register", methods=["POST"])
def register():
    schema = RegistrationForm()

    try:
        data = schema.load(request.json)
    except ValidationError as ve:
        return jsonify({"errors": ve.messages}), 400

    if view_user_nameemail(data.user_name):
        return jsonify({"error": "Username already exists"}), 409

    if view_user_nameemail(data.email):
        return jsonify({"error": "Email already exists"}), 409

    data["user_password"] = bcrypt.hashpw(
        data["user_password"].encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    insertor.table("users").values(data).execute()

    return jsonify({"success": True, "message": "Successfully registered!"})


# ============
# LOGIN
# =======
@auth.route("/login", methods=["POST"])
def login():
    schema = LoginForm()

    try:
        data = schema.load(request.json)
    except ValidationError as ve:
        return jsonify({"errors": ve.messages}), 400

    username_or_email = data["identity"]
    password = data["user_password"]

    found = view_user_nameemail(username_or_email)

    if not found:
        return jsonify({"success": False, "message": "Account not found"}), 404

    user = found[0]

    if not bcrypt.checkpw(password.encode(), user["user_password"].encode()):
        return jsonify({"success": False, "message": "Incorrect password"}), 401

    user_id = user["user_id"]
    role = user["role_id"]
    token_version = user.get("token_version", 0)

    # access token
    access_token = create_access_token(
        identity={
            "user_id":user_id,
            "role": role,
            "token_version":token_version,
        },
        
        expires_delta = datetime.timedelta(hours=1)
    )

    # refresh token
    refresh_token = create_refresh_token(
        identity={
            "user_id":user_id,
            "role": role,
            "token_version":token_version
        },
        
        expires_delta = datetime.timedelta(hours=9)
    )

    response = make_response(jsonify({
        "success": True,
        "message": "Logged in!",
        "access_token": access_token,
        "role": role,
        "user": user_id
    }))

    response.set_cookie(
        "refresh_token",
        refresh_token,
        httponly=True,
        secure=True, 
        samesite="Strict",
        path="/api/auth/refresh"
    )

    return response


# ============
# REFRESH
# =======
@auth.route("/refresh", methods=["GET"])
@jwt_required(refresh=True, locations=["cookies"])
def refresh():
    user_identity = get_jwt_identity()
    claims = get_jwt()

    access_token = create_access_token(
        identity=user_identity
    )

    return jsonify({
        "accessToken": access_token
    }), 200


# # ============
# # ME
# # =======
@auth.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    claims = get_jwt()

    return jsonify({
        "isLoggedIn": True,
        "user": {
            "user_id": user_id,
            "role": claims.get("role")
        }
    })
