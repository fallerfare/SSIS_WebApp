from marshmallow import Schema, fields, validate, ValidationError

class CollegeSchema(Schema):
    
    college_code = fields.Str(
        required=True, 
        validate=validate.Length(min=1, max=15, error="College Code must be 1 to 15 characters long")
    )

    college_name = fields.Str(
        required=True, 
        validate=validate.Length(min=1, max=50, error="College Name must be 1 to 50 characters long")
    )
    
