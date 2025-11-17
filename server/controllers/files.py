import cloudinary
import cloudinary.uploader
from flask import Blueprint, jsonify, request
from services.Functions import Update, Select

handleFiles = Blueprint("handleFiles", __name__, url_prefix="/api/files")

updator = Update.Update()
selector = Select.Select()

@handleFiles.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("image")
    student = request.form.get("student")

    if file is None:
        return jsonify({"error": "No file uploaded"}), 400

    result = cloudinary.uploader.upload(file)
    url = result["secure_url"]

    print(url)
    print(student)

    updator.table("students")\
                .set({
                    "id_picture":url
                })\
                .where(whereCol="id_number", whereVal=student)\
                .execute()
    
    return jsonify({"success": True, "url": url})