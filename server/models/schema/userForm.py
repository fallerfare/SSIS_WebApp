from marshmallow import Schema, fields, validate, ValidationError

class UserSchema(Schema):
    user_name = fields.Str(
        required=True,
        validate=validate.Length(
            min=3,
            max=50,
            error="Username must be between 3 and 50 characters long"
        )
    )

    user_password = fields.Str(
        required=True,
        load_only=True, 
        validate=validate.Length(
            min=6,
            max=255,
            error="Password must be at least 6 characters long"
        )
    )

    user_email = fields.Email(
        required=False,
        allow_none=True,
        validate=validate.Length(
            min=5,
            max=100,
            error="Email must be 5 to 100 characters long"
        ),
        error_messages={"invalid": "Invalid email address"}
    )

    id_number = fields.Int(
        required=False,
        allow_none=True,
        validate=validate.Range(
            min=1,
            error="Invalid student ID number"
        )
    )

    id_picture = fields.Str(
        required=False,
        allow_none=True
    )
