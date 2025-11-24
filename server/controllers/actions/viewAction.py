from flask import Blueprint, jsonify, request
from services.Functions.Select import Select
from models.students import Student
from models.programs import Program
from models.colleges import College
from models.users import User

viewer = Blueprint("viewer", __name__)

# ========================== 
# STUDENT VIEW
# ==========
@viewer.route("/view/students/<string:id_number>", methods = ["GET"])
def view_students(id_number):
    student = Student()         
    data = student.get(id_number)  

    if not data:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(data), 200

@viewer.route("/view/students/programName/<string:program_code>", methods = ["GET"])
def view_students_program_name(program_code):
    selector = Select()
    program_name = selector\
                                .table("programs")\
                                .search("program_code", program_code)\
                                .special_col(["program_name"])\
                                .execute()\
                                .retDict()

    return jsonify({
        "program_name":program_name[0]["program_name"]
    })

@viewer.route("/view/students/collegeName/<string:college_code>", methods = ["GET"])
def view_students_college_name(college_code):
    selector = Select()
    college_name = selector\
                                .table("colleges")\
                                .search("college_code", college_code)\
                                .special_col(["college_name"])\
                                .execute()\
                                .retDict()

    return jsonify({
        "college_name":college_name[0]["college_name"]
    })


# ========================== 
# PROGRAM VIEW
# ==========
@viewer.route("/view/programs/<string:program_code>", methods = ["GET"])
def view_programs(program_code):
    program = Program()         
    data = program.get(program_code)  

    if not data:
        return jsonify({"error": "Program not found"}), 404

    return jsonify(data), 200


# ========================== 
# COLLEGE VIEW
# ==========
@viewer.route("/view/colleges/<string:college_code>", methods = ["GET"])
def view_colleges(college_code):
    college = College()         
    data = college.get(college_code)  

    if not data:
        return jsonify({"error": "College not found"}), 404

    return jsonify(data), 200


# ========================== 
# USER VIEW
# ==========
@viewer.route("/view/users/<int:id_number>", methods = ["GET"])
def viewusers(id_number):
    user = User()         
    data = user.get(id_number)  

    if not data:
        return jsonify({"error": "User not found"}), 404

    return jsonify(data), 200