from flask import Flask, jsonify, request
import atexit
from Functions.connection import connection_pool
from Functions.Select import Select
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route("/")
def home():
    return "Hello Skibidi"

# ========================== 
# LIST
# ==========
@app.route("/<string:table>/list")
def list(table): 
    # tag = request.args.get('tag', '')
    # key = request.args.get('key', '')
    # sort = request.args.get('sort', '')
    # order = request.args.get('order', 'asc')
    limit = int(request.args.get('size', 10)) 
    page = int(request.args.get('page', 0))

    selector = Select()   
    total       = selector\
                        .table(table)\
                        .execute()\
                        .retDict()
    contents = selector\
                        .table(table)\
                        .limit(limit)\
                        .offset(page)\
                        .execute()\
                        .retDict()

    return jsonify({
         "data": contents,
        "total": len(total),
        "page": page,
        "limit": limit,
        "totalPages": (len(total) + limit - 1)
    })

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
# CLOSE
# ==========
@atexit.register
def shutdown_pool():
    if connection_pool:
        connection_pool.closeall()

if __name__ == "__main__":
    app.run(debug = True, port = 8080)