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

    sorts_str = request.args.get("sorts", "[]")
    try:
        sorts = json.loads(sorts_str)
        if not isinstance(sorts, list) or len(sorts) == 0:
            sorts = default_sort
    except Exception:
        sorts = default_sort

    filters_str = request.args.get("filters", "{}")
    try:
        filters = json.loads(filters_str)
        if not isinstance(filters, dict):
            filters = {}
    except Exception:
        filters = {}

    limit = int(request.args.get('size', 10)) 
    page = int(request.args.get('page', 0))

    selector = Select()   

    total       = selector\
                        .table(table)\
                        .search(tag = tag, key = key, search_mult=filters)\
                        .execute()\
                        .retDict()
    contents = selector\
                        .table(table)\
                        .search(tag = tag, key = key, search_mult=filters)\
                        .limit(limit)\
                        .offset(page)\
                        .sort(sorts)\
                        .execute()\
                        .retDict()

    return jsonify({
        "data": contents,
        "total": len(total),
        "page": page,
        "limit": limit,
        "totalPages": math.ceil(len(total) / limit)
    })