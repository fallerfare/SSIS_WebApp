from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from models.students import Student
from models.programs import Program
from models.colleges import College
from models.schema import studentForm, collegeForm, programForm, userForm
from models.users import User

editor = Blueprint("editor", __name__)

# ========================== 
# USER EDIT
# ==========
@editor.route("/edit/users/<string:id_number>", methods = ["PUT"])
def edit_users(id_number):
    user = User()         
    data = user.get(id_number)  
    schema = userForm.UserSchema()
    
    if not data:
        return jsonify({"error": "User not found"}), 404
    
    updates = request.json
    if not updates: 
        return jsonify({"error": "No data provided"})

    try:
        validated_data = schema.load(updates)
        user.edit(id_number, validated_data)
        return jsonify({"message": "User updated successfully"}), 200
    
    except ValidationError as err:
        return jsonify({
            "error": "Validation failed",
            "details": err.messages,  
        }), 400

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500
    
# ========================== 
# STUDENT EDIT
# ==========
@editor.route("/edit/students/<string:id_number>", methods = ["PUT"])
def edit_students(id_number):
    student = Student()         
    data = student.get(id_number)  
    schema = studentForm.StudentSchema()
    
    if not data:
        return jsonify({"error": "Student not found"}), 404
    
    updates = request.json
    if not updates: 
        return jsonify({"error": "No data provided"})

    try:
        validated_data = schema.load(updates)
        student.edit(id_number, validated_data)
        return jsonify({"message": "Student updated successfully"}), 200
    
    except ValidationError as err:
        return jsonify({
            "error": "Validation failed",
            "details": err.messages,  
        }), 400

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500


# ========================== 
# PROGRAM EDIT
# ==========
@editor.route("/edit/programs/<string:program_code>", methods = ["PUT"])
def edit_programs(program_code):
    program = Program()         
    data = program.get(program_code)  
    schema = programForm.ProgramSchema()

    if not data:
        return jsonify({"error": "Program not found"}), 404
    
    updates = request.json
    if not updates: 
        return jsonify({"error": "No data provided"})

    try:
        validated_data = schema.load(updates)
        program.edit(program_code, validated_data)
        return jsonify({"message": "Program updated successfully"}), 200
    
    except ValidationError as err:
        return jsonify({
            "error": "Validation failed",
            "details": err.messages
        }), 400

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500


# ========================== 
# COLLEGE EDIT
# ==========
@editor.route("/edit/colleges/<string:college_code>", methods = ["PUT"])
def edit_colleges(college_code):
    college = College()         
    data = college.get(college_code)  
    schema = collegeForm.CollegeSchema()

    if not data:
        return jsonify({"error": "College not found"}), 404

    updates = request.json
    if not updates: 
        return jsonify({"error": "No data provided"})

    try:
        validated_data = schema.load(updates)
        college.edit(college_code, validated_data)
        return jsonify({"message": "College updated successfully"}), 200
    
    except ValidationError as err:
        return jsonify({
            "error": "Validation failed",
            "details": err.messages
        }), 400

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500