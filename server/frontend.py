from flask import Blueprint, send_from_directory, current_app, request
import os
import pathlib

frontend = Blueprint("frontend", __name__)

@frontend.route("/", defaults={"path": ""})
@frontend.route("/<path:path>")
def serve_react(path):
    static_folder = current_app.static_folder
    # file_path = os.path.join(static_folder, path)
    file_path = pathlib.Path(static_folder) / path

    if request.path.startswith("/api"):
        print("Requested path:", request.path)
        return "Not Found", 404

    if path != "" and os.path.exists(file_path):
        print("Requested path:", request.path)
        return send_from_directory(static_folder, path)
    
    print("Requested path:", request.path)
    return send_from_directory(static_folder, "index.html")