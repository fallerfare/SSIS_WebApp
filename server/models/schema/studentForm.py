from marshmallow import Schema, fields, validate, ValidationError

class StudentSchema(Schema):
    id_number = fields.Str(
        required=True,
        validate=validate.Length(equal=9, error="Student ID must be 9 characters long in the format YYYY-NNNN")
    )

    first_name = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=50, error="First name must be 1 to 50 characters long")
    )

    middle_name = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=50, error="Middle name must be 1 to 50 characters long")
    )

    last_name = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=50, error="Last name must be 1 to 50 characters long")
    )

    email = fields.Email(
        required=True,
        error_messages={"invalid": "Invalid email address"},
        validate=validate.Length(min=1, max=100, error="Email must be 1 to 100 characters long")
    )

    gender = fields.Str(
        required=True,
        validate=[
            validate.OneOf(["Male", "Female", "Others"], error="Invalid gender"),
            validate.Length(min=1, max=7, error="Gender is required")
        ]
    )

    year_level = fields.Int(
        required=True,
        validate=validate.Range(min=1, max=5, error="Year level must be between 1 and 5")
    )

    college_code = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=15, error="College must be 1 to 15 characters long")
    )

    program_code = fields.Str(
        required=True,
        validate=validate.Length(min=1, max=15, error="Program must be 1 to 15 characters long")
    )
