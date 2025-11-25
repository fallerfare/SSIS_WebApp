from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from psycopg2 import IntegrityError
from models.students import Student
from models.programs import Program
from models.colleges import College
from models.schema import studentForm
from models.schema import programForm
from models.schema import collegeForm

insertier = Blueprint("insertier", __name__, url_prefix="/api/create")

# ========================== 
# STUDENT INSERT
# ==========
@insertier.route("/students", methods = ["POST"])
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
    
    except ValidationError as ve:
        return jsonify({
            "error": "Validation failed",
            "details": ve.messages
        }), 400
    
    except IntegrityError as ie:
        err_msg =  str(ie).split('\n')[0]
        id_number = validated_data.get('id_number')
        print(err_msg)

        if "students_pkey" in err_msg:
            err_msg = f"Student of ID Number: {id_number} already exists."

        return jsonify({
            "error": "Integrity failed",
            "details": err_msg
        }), 409

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500


# ========================== 
# PROGRAM INSERT
# ==========
@insertier.route("/programs", methods = ["POST"])
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
    
    except ValidationError as ve:
        return jsonify({
            "error": "Validation failed",
            "details": ve.messages
        }), 400
    
    except IntegrityError as ie:
        err_msg =  str(ie).split('\n')[0]
        program_code = validated_data.get('program_code')
        print(err_msg)

        if "students_pkey" in err_msg:
            err_msg = f"Program of Code: {program_code} already exists."

        return jsonify({
            "error": "Integrity failed",
            "details": err_msg
        }), 409

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500


# ========================== 
# COLLEGE INSERT
# ==========
@insertier.route("/colleges", methods = ["POST"])
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
    
    except ValidationError as ve:
        return jsonify({
            "error": "Validation failed",
            "details": ve.messages
        }), 400
    
    except IntegrityError as ie:
        err_msg =  str(ie).split('\n')[0]
        college_code = validated_data.get('college_code')
        print(err_msg)

        if "students_pkey" in err_msg:
            err_msg = f"College of Code: {college_code} already exists."

        return jsonify({
            "error": "Integrity failed",
            "details": err_msg
        }), 409

    except Exception as e:
        print(f"Server error: {e}")
        return jsonify({
            "error": "Server error. Please try again later."
        }), 500