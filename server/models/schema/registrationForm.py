from marshmallow import Schema, fields, validate

class RegistrationForm(Schema):
    user_name = fields.Str(
        required=True,
        validate=validate.Length(min=3, max=20, error="Username must be 3–20 characters")
    )
    user_email = fields.Email(
        required=True,
        error_messages={"required": "Email is required", "invalid": "Invalid email address"}
    )
    user_password = fields.Str(
        required=True,
        validate=validate.Length(min=3, error="Password must be at least 6 characters")
    )
 