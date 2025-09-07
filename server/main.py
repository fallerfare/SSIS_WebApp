from flask import Flask, jsonify, request
import atexit
from Functions.connection import connection_pool
from Functions.Select import Select

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello Skibidi"

# ========================== 
# LIST
# ==========
@app.route("/<string:table>/list")
def list(table): 
    selector = Select()   
    contents = selector.table(table)\
                        .execute()\
                        .retData()
    return jsonify(contents)

# ========================== 
# COLUMN
# ==========
@app.route("/<string:table>/columns")
def columns(table): 
    selector = Select()   
    contents = selector.table(table)\
                        .tableCols()
    return jsonify(contents)

# ========================== 
# FILTER
# ==========
@app.route("/<string:table>/filter")
def studentsSearch(table):    
    tag = request.args['tag']
    key = request.args['key']
    sort = request.args['sort']
    order = request.args['order']
    limit = request.args['limit']
    selector = Select()
    students = selector.table(table)\
                        .search(tag, key)\
                        .sort(sort, order)\
                        .limit(limit)\
                        .execute()\
                        .retData()
    return jsonify(students)

# ========================== 
# CLOSE
# ==========
@atexit.register
def shutdown_pool():
    if connection_pool:
        connection_pool.closeall()

if __name__ == "__main__":
    app.run(debug = True, port = 8080)