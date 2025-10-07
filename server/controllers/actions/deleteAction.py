from flask import Blueprint, jsonify
from models.students import Student
from models.programs import Program
from models.colleges import College

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
    program.delete("program_code", program_code)  
    return jsonify({"message": f"Student {program_code} deleted successfully"}), 200


# ========================== 
# COLLEGE DELETE
# ==========
@deletor.route("/delete/colleges/<string:college_code>", methods = ["DELETE"])
def delete_colleges(college_code):
    college = College()         
    print(college_code)
    college.delete("college_code", college_code)  
    return jsonify({"message": f"Student {college_code} deleted successfully"}), 200