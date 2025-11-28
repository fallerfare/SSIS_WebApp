from flask import Blueprint, request, jsonify
from services.Functions.Select import Select
import math, json

tableList = Blueprint("tableList", __name__, url_prefix="/api/table")

# ========================== 
# PAGINATED LIST
# ==========
@tableList.route("/<string:table>")
def list(table): 

    match table:
        case "students":
            default_sort = [{"id": "id_number", "order": "ASC"}]
        case "programs":
            default_sort = [{"id": "program_code", "order": "ASC"}]
        case "colleges":
            default_sort = [{"id": "college_code", "order": "ASC"}]
    
    tag = request.args.get('tag', '')
    key = request.args.get('key', '')

    sorts_list = default_sort

    sorts_str = request.args.get("sorts", "[]")
    try:
        sorts_list = json.loads(sorts_str)
        if not isinstance(sorts_list, list) or len(sorts_list) == 0:
            sorts = default_sort
    except Exception:
        sorts = default_sort

    limit = int(request.args.get('size', 10)) 
    page = int(request.args.get('page', 0))

    selector = Select()   

    if tag == "name":
        total       = selector\
                            .table(table)\
                            .search(search_mult={"first_name": key, "middle_name": key, "last_name": key}, connector = " OR ")\
                            .execute()\
                            .retDict()
        contents = selector\
                            .table(table)\
                            .search(search_mult={"first_name": key, "middle_name": key, "last_name": key}, connector = " OR ")\
                            .limit(limit)\
                            .offset(page)\
                            .sort(sorts_list)\
                            .execute()\
                            .retDict()

    else:
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
                            .sort(sorts_list)\
                            .execute()\
                            .retDict()

    return jsonify({
        "data": contents,
        "total": len(total),
        "page": page,
        "limit": limit,
        "totalPages": math.ceil(len(total) / limit)
    })
