from flask import Blueprint, request, jsonify
from models.Functions.Select import Select
import math

tableList = Blueprint("tableList", __name__)

# ========================== 
# LIST
# ==========
@tableList.route("/<string:table>/list")
def list(table): 
    tag = request.args.get('tag', '')
    key = request.args.get('key', '')
    # sort = request.args.get('sort', '')
    # order = request.args.get('order', 'asc')
    limit = int(request.args.get('size', 10)) 
    page = int(request.args.get('page', 0))

    selector = Select()   
    total       = selector\
                        .table(table)\
                        .search(tag, key)\
                        .execute()\
                        .retDict()
    contents = selector\
                        .table(table)\
                        .search(tag, key)\
                        .limit(limit)\
                        .offset(page)\
                        .execute()\
                        .retDict()

    return jsonify({
        "data": contents,
        "total": len(total),
        "page": page,
        "limit": limit,
        "totalPages": math.ceil(len(total) / limit)
    })

# ========================== 
# COLUMN
# ==========
@tableList.route("/<string:table>/columns")
def columns(table): 
    selector = Select()   
    contents = selector.table(table)\
                        .tableCols()
    return jsonify(contents)
