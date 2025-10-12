from flask import Blueprint, jsonify, make_response
from models.students import Student
from models.programs import Program
from models.colleges import College
from psycopg2 import errors
from psycopg2.errors import ForeignKeyViolation

deletor = Blueprint("deletor", __name__)

# ========================== 
# STUDENT DELETE
# ==========
@deletor.route("/delete/students/<string:id_number>", methods = ["DELETE"])
def delete_students(id_number):
    student = Student()         
    print(id_number)
    student.delete(id_number)  
    return jsonify({"message": f"Student {id_number} deleted successfully"}), 200


# ========================== 
# PROGRAM DELETE
# ==========
@deletor.route("/delete/programs/<string:program_code>", methods = ["DELETE"])
def delete_programs(program_code):
    program = Program()         
    print(program_code)
    try:
        program.delete(program_code)  
        return jsonify({"message": f"Program {program_code} deleted successfully"}), 200
    except errors.ForeignKeyViolation as fke:
        constraint_name = getattr(fke.diag, "constraint_name", None)
        if constraint_name == "fk_student_program":
            message = "MEOW!!! This program can not be deleted at the moment as there are still students enrolled under it!"
            print(message)
        else:
            message = f"Deletion has been blocked by error: {constraint_name or 'unknown constraint'}"
        
        return jsonify({
            "success": False,
            "error": "ForeignKeyViolation",
            "constraint": constraint_name,
            "message": message
        }), 400



# ========================== 
# COLLEGE DELETE
# ==========
@deletor.route("/delete/colleges/<string:college_code>", methods = ["DELETE"])
def delete_colleges(college_code):
    college = College()         
    print(college_code)
    try:
        college.delete(college_code)  
        return jsonify({"message": f"College {college_code} deleted successfully"}), 200
    except errors.ForeignKeyViolation as fke:
        constraint_name = getattr(fke.diag, "constraint_name", None)
        if constraint_name == "fk_program_college":
            message = "MEOW!!! This college can not be deleted at the moment as there are still programs established under it!"
            print(message)
        else:
            message = f"Deletion has been blocked by error: {constraint_name or 'unknown constraint'}"
        
        return jsonify({
            "success": False,
            "error": "ForeignKeyViolation",
            "constraint": constraint_name,
            "message": message
        }), 400
    