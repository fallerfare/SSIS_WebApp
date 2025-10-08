from flask import Blueprint, jsonify, request
from models.students import Student
from models.programs import Program
from models.colleges import College

insertier = Blueprint("insertier", __name__)

# ========================== 
# STUDENT INSERT
# ==========
@insertier.route("/create/students", methods = ["POST"])
def add_students():
    student = Student()   
   
    data = request.json

    print("Backedn received data: ", data)
    if not data: 
        return jsonify({"error": "No data provided"})

    try: 
        student.add(data)
        return jsonify({"message": "Student added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ========================== 
# PROGRAM INSERT
# ==========
@insertier.route("/create/programs/<string:program_code>", methods = ["PUT"])
def edit_programs(program_code):
    program = Program()         
    print(program_code)
    data = program.get(program_code)  

    if not data:
        return jsonify({"error": "Program not found"}), 404

    return jsonify(data), 200


# ========================== 
# COLLEGE INSERT
# ==========
@insertier.route("/create/colleges/<string:college_code>", methods = ["PUT"])
def edit_colleges(college_code):
    college = College()         
    print(college_code)
    data = college.get(college_code)  

    if not data:
        return jsonify({"error": "College not found"}), 404

    return jsonify(data), 200