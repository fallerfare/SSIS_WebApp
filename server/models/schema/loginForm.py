from marshmallow import Schema, fields, validate

class LoginForm(Schema):
    identity = fields.Str(
        required=True
    )
    user_password = fields.Str(
        required=True
    )
