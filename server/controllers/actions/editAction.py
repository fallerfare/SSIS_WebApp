from flask import Blueprint, jsonify, request
from models.students import Student
from models.programs import Program
from models.colleges import College

editor = Blueprint("editor", __name__)

# ========================== 
# STUDENT EDIT
# ==========
@editor.route("/edit/students/<string:id_number>", methods = ["PUT"])
def edit_students(id_number):
    student = Student()         
    print(id_number)
    data = student.get(id_number)  
    
    if not data:
        return jsonify({"error": "Student not found"}), 404
    
    updates = request.json
    if not updates: 
        return jsonify({"error": "No data provided"})

    try:
        student.edit(id_number, updates)
        return jsonify({"message": "Student updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ========================== 
# PROGRAM EDIT
# ==========
@editor.route("/edit/programs/<string:program_code>", methods = ["PUT"])
def edit_programs(program_code):
    program = Program()         
    print(program_code)
    data = program.get(program_code)  

    if not data:
        return jsonify({"error": "Program not found"}), 404
    
    updates = request.json
    if not updates: 
        return jsonify({"error": "No data provided"})

    try:
        program.edit(program_code, updates)
        return jsonify({"message": "Program updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ========================== 
# COLLEGE EDIT
# ==========
@editor.route("/edit/colleges/<string:college_code>", methods = ["PUT"])
def edit_colleges(college_code):
    college = College()         
    print(college_code)
    data = college.get(college_code)  

    if not data:
        return jsonify({"error": "College not found"}), 404

    updates = request.json
    if not updates: 
        return jsonify({"error": "No data provided"})

    try:
        college.edit(college_code, updates)
        return jsonify({"message": "College updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500