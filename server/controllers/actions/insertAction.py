from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from models.students import Student
from models.programs import Program
from models.colleges import College
from models.schema import studentForm
from models.schema import programForm
from models.schema import collegeForm

insertier = Blueprint("insertier", __name__)

# ========================== 
# STUDENT INSERT
# ==========
@insertier.route("/create/students", methods = ["POST"])
def add_students():
    student = Student()   
    data = request.json
    schema = studentForm.StudentSchema()

    if not data: 
        return jsonify({"error": "No data provided"})

    try: 
        validated_data = schema.load(data)
        student.add(validated_data)
        return jsonify({"message": "Student added successfully"}), 201
    
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
# PROGRAM INSERT
# ==========
@insertier.route("/create/programs", methods = ["POST"])
def edit_programs():
    program = Program()         
    data = request.json
    schema = programForm.ProgramSchema()

    if not data:
        return jsonify({"error": "No data proided"}), 404

    try: 
        validated_data = schema.load(data)
        program.add(validated_data)
        return jsonify({"message": "Program established successfully"}), 201
    
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
# COLLEGE INSERT
# ==========
@insertier.route("/create/colleges", methods = ["POST"])
def edit_colleges():
    college = College()         
    data = request.json
    schema = collegeForm.CollegeSchema()

    if not data:
        return jsonify({"error": "No data proided"}), 404

    try: 
        validated_data = schema.load(data)
        college.add(validated_data)
        return jsonify({"message": "College established successfully"}), 201
    
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