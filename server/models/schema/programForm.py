from marshmallow import Schema, fields, validate, ValidationError

class ProgramSchema(Schema):
    
    program_code = fields.Str(
        required=True, 
        validate=validate.Length(min=1, max=15, error="Program Code must be 1 to 15 characters long")
    )
    
    program_name = fields.Str(
        required=True, 
        validate=validate.Length(min=1, max=50, error="Program Name must be 1 to 50 characters long")
    )
    
    college_code = fields.Str(
        required=True, 
        validate=validate.Length(min=1, max=15, error="College Code must be 1 to 15 characters long")
    )
