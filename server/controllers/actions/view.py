from flask import Blueprint, jsonify, request, session
from services.Functions import Insert, Select
from models.students import Student

viewer = Blueprint("viewer", __name__)

# ========================== 
# STUDENT VIEW
# ==========
@viewer.route("/api/students/<string:id_number>", methods = ["GET"])
def view(id_number):
    student = Student()         
    print(id_number)
    data = student.get(id_number)  

    if not data:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(data), 200