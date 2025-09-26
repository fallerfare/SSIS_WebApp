from flask import Flask
import atexit
from flask_wtf import CSRFProtect
from models.Functions.connection import connection_pool
from flask_cors import CORS
import os
from dotenv import load_dotenv
from controllers.authentication import auth
from controllers.tableList import tableList

load_dotenv()


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['WTF_CSRF_SECRET_KEY'] = os.getenv('WTF_CSRF_SECRET_KEY')

csrf = CSRFProtect(app)

app.register_blueprint(tableList)
app.register_blueprint(auth)

# ========================== 
# CLOSE
# ==========
@atexit.register
def shutdown_pool():
    if connection_pool:
        connection_pool.closeall()

if __name__ == "__main__":
    app.run()

