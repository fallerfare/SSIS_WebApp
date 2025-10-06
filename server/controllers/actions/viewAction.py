from flask import Blueprint, jsonify, request
from models.students import Student
from models.programs import Program
from models.colleges import College

viewer = Blueprint("viewer", __name__)

# ========================== 
# STUDENT VIEW
# ==========
@viewer.route("/api/students/<string:id_number>", methods = ["GET"])
def view_students(id_number):
    student = Student()         
    print(id_number)
    data = student.get(id_number)  

    if not data:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(data), 200


# ========================== 
# PROGRAM VIEW
# ==========
@viewer.route("/api/programs/<string:program_code>", methods = ["GET"])
def view_programs(program_code):
    program = Program()         
    print(program_code)
    data = program.get(program_code)  

    if not data:
        return jsonify({"error": "Program not found"}), 404

    return jsonify(data), 200


# ========================== 
# COLLEGE VIEW
# ==========
@viewer.route("/api/colleges/<string:college_code>", methods = ["GET"])
def view_colleges(college_code):
    college = College()         
    print(college_code)
    data = college.get(college_code)  

    if not data:
        return jsonify({"error": "College not found"}), 404

    return jsonify(data), 200