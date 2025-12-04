import cloudinary
import cloudinary.uploader
from flask import Blueprint, jsonify, request
from services.Functions import Update, Select

handleFiles = Blueprint("handleFiles", __name__, url_prefix="/api/files")

updator = Update.Update()
selector = Select.Select()

def extract_public_id(url: str):
    if not url:
        return None

    filename = url.split("/")[-1]             
    public_id = filename.rsplit(".", 1)[0]  
    return public_id

@handleFiles.route("/upload", methods=["POST"])
def upload():
    object = request.form.get("object")
    file = request.files.get("image")
    id = request.form.get("id")

    if file is None:
        return jsonify({
            "success": False,
            "error": "No file uploaded",
        }), 400
    
    existing = selector.table(object)\
                    .search("id_number", id)\
                    .execute().retDict()[0]
    
    old_url = existing.get("id_picture") if existing else None
    old_public_id = extract_public_id(old_url)

    if old_public_id:
        try:
            cloudinary.uploader.destroy(old_public_id)
        except Exception as e:
            print("Cloudinary delete error:", e)
            return jsonify({
                "success": False,
                "error": f"Cloudinary delete error: {e}"
            }), 500

    type = file.filename.rsplit(".", 1)[-1]
    new_name = f"{id}.{type}"

    result = cloudinary.uploader.upload(
        file,
        public_id=new_name,
        overwrite=True,
        resource_type="image"
    )

    url = result["secure_url"]

    updator.table(object)\
                .set({"id_picture":url})\
                .where("id_number", id)\
                .execute()
    
    return jsonify({
        "success": True,
        "message": "Successfully uploaded image!", 
        "url": url
    }), 201

@handleFiles.route("/delete", methods=["DELETE"])
def delete_image():
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "error": "Missing request body",
        }), 400

    object = data.get("object")
    id = data.get("id")

    record = selector.table(object)\
                    .search("id_number", id)\
                    .execute().retDict()[0]
    
    print("Record: ", record)

    if not record or not record.get("id_picture"):
        return jsonify({
            "success": False,
            "error": "No image found"
        }), 404

    url = record["id_picture"]
    public_id = extract_public_id(url)

    cloudinary.uploader.destroy(public_id)

    updator.table(object)\
           .set({"id_picture": "NULL"})\
           .where("id_number", id)\
           .execute()

    return jsonify({
        "success": True, 
        "message": "Successfully deleted Image!"
    }), 201
