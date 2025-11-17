from flask import Flask, jsonify, request
import atexit
from flask_wtf import CSRFProtect
from flask_wtf.csrf import generate_csrf
from controllers.dbconnection.connection import connection_pool
from flask_cors import CORS
import os
from dotenv import load_dotenv
from controllers.authentication import auth
from controllers.tableList import tableList
from controllers.actions.viewAction import viewer
from controllers.actions.editAction import editor
from controllers.actions.deleteAction import deletor
from controllers.actions.insertAction import insertier
from controllers.files import uploadFiles
import cloudinary

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['WTF_CSRF_SECRET_KEY'] = os.getenv('WTF_CSRF_SECRET_KEY')

cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("CLOUD_API_KEY"),
    api_secret=os.getenv("CLOUD_API_SECRET")
)


app.register_blueprint(tableList)
app.register_blueprint(auth)
app.register_blueprint(viewer)
app.register_blueprint(editor)
app.register_blueprint(deletor)
app.register_blueprint(insertier)
app.register_blueprint(uploadFiles)

csrf = CSRFProtect(app)

# ========================== 
# API
# ==========
@app.route("/api/csrf-token", methods=["GET"])
def get_csrf_token():
    token = generate_csrf()                
    return jsonify({"csrf_token": token})  

# ========================== 
# CLOSE
# ==========
@atexit.register
def shutdown_pool():
    if connection_pool:
        connection_pool.closeall()

if __name__ == "__main__":
    app.run()

