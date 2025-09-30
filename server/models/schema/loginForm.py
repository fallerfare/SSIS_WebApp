from marshmallow import Schema, fields, validate

class LoginForm(Schema):
    user_name = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=20, error="Username must be 3–20 characters")
    )
    user_password = fields.Str(
        required=True,
        validate=validate.Length(min=3, error="Password must be at least 3 characters")
    )
