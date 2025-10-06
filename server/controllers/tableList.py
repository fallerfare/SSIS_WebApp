from flask import Blueprint, request, jsonify
from services.Functions.Select import Select
import math

tableList = Blueprint("tableList", __name__)

# ========================== 
# PAGINATED LIST
# ==========
@tableList.route("/table/<string:table>")
def list(table): 

    match table:
        case "students":
            def_col = "id_number"
        case "programs":
            def_col = "program_code"
        case "colleges":
            def_col = "college_code"
    
    tag = request.args.get('tag', '')
    key = request.args.get('key', '')
    sort = request.args.get('sort', def_col)
    order = request.args.get('order', 'asc')
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
                        .sort(sort, order)\
                        .execute()\
                        .retDict()

    return jsonify({
        "data": contents,
        "total": len(total),
        "page": page,
        "limit": limit,
        "totalPages": math.ceil(len(total) / limit)
    })
