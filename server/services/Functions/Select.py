from controllers.dbconnection import connection

class Select():
    def __init__(self):
        self.params         = []
        self.basequery      = f"SELECT "
        self.columnquery    = f""
        self.tablequery     = f""
        self.searchquery    = f""
        self.groupquery     = f""
        self.sortquery      = f""
        self.limitquery     = f""
        self.offsetquery = f""
        self.countquery = f""
        self.table_name = None
        self.columns = []
        self.rows = []
        self.aliascolumn = {}

    
    def table(self, table):
        self.table_name = table
        self.tablequery = f"FROM {table}"
        self.columns = connection.get_columns(f"{table}")
        self.columnquery = ", ".join([f"{table}.{col}" for col in self.columns])
        return self
    
    def limit(self, limit):
        self.limitquery = f"LIMIT {limit}"
        return self
    
    def offset(self, offset):
        self.offsetquery = f"OFFSET {offset*10}"
        return self

    def group(self, group):
        self.groupquery = f"GROUP BY {group}"
        return self
    
    def count(self, count):
        self.countquery = (f"COUNT {count or "*"}")
        return self
    
    def sort(self, sorts):
        conditions = []

        for s in sorts:
            column = s["id"]
            order = s["order"].upper()  
            sort_tag = self.aliascolumn.get(column, f"{self.table_name}.{column}")
            print("SORTING TAG: ", sort_tag)
            if sort_tag == "students.name":
                conditions.extend([
                    f"first_name {order}",
                    f"middle_name {order}",
                    f"last_name {order}"
                ])
            else:
                conditions.append(f"{sort_tag} {order}")

        if conditions:
            self.sortquery = "ORDER BY " + ", ".join(conditions)
        else:
            self.sortquery = ""

        return self

    
    def special_col(self, spec_col):
        self.columnquery    = ", ".join([f"{col}" for col in spec_col])
        self.columns = [col.split(" AS ")[-1].split(".")[-1] for col in spec_col]
        return self
    
    def search(self, tag = None, key = None, table = None, search_mult = {}, connector = "AND"):
        self.searchquery = ""
        self.params = []

        if table is None:
            table = self.table_name

        if search_mult:
            conditions = []
            for col, val in search_mult.items():
                search_tag = self.aliascolumn.get(col, f"{table}.{col}")
                if col == "year_level" or (col == "id_number" and self.table_name == "users"):
                    conditions.append(f"{search_tag} = %s")
                    self.params.append(int(val))
                elif col == "id_picture":
                    continue
                elif val == "Male":  
                    conditions.append(f"{search_tag} = %s")
                    self.params.append(val)
                else:
                    conditions.append(f"{search_tag} LIKE %s")
                    self.params.append(f"%{val}%")
            self.searchquery = "WHERE " + connector.join(conditions)

        elif tag and key not in (None, ""):
            search_tag = self.aliascolumn.get(tag, f"{table}.{tag}")
            self.searchquery = f"WHERE {search_tag} LIKE %s "
            if tag == "year_level" or (tag == "id_number" and self.table_name == "users"):
                self.searchquery = f"WHERE {search_tag} = %s"
                self.params.append(int(key))
            elif search_tag == "id_picture":
                pass
            elif key == "Male":
                self.params.append(f"{key}")
            else:
                self.params.append(f"%{key}%")

        elif key not in (None, ""):            
            searchAll = []
            for col in self.columns:
                if col == "id_picture":
                    continue  
                elif col == "year_level" or (col == "id_number" and self.table_name == "users"):
                    if isinstance(key, int):
                        searchAll.append(f"{col} = %s")
                    else:
                        continue
                else:
                    searchAll.append(f"{col} LIKE %s")

            for col in self.columns:
                if col == "id_picture":
                    continue        
                elif col == "year_level" or (col == "id_number" and self.table_name == "users"):
                    if isinstance(key, int):
                        self.params.append(key)
                    else:
                        continue
                else:
                    self.params.append(f"%{key}%")
            self.searchquery = "WHERE " + " OR ".join(searchAll)
        
        return self
    
    def execute(self, params = None):
        
        if params is not None:
            self.params = params

        self.query = " ".join([
                    self.basequery,
                    self.countquery,
                    self.columnquery,
                    self.tablequery,
                    self.searchquery,
                    self.groupquery,
                    self.sortquery,
                    self.limitquery,
                    self.offsetquery
                    ]).strip()
        print(self.query)
        print(self.params)

        conn = None
        try:
            conn = connection.get_conn()
            with conn.cursor() as cursor:
                cursor.execute(self.query, self.params)
                self.rows = cursor.fetchall()
                return self
        except Exception as exception:
            print(f"Error selecting : {exception}")
            if conn:
                conn.rollback()
        finally:
            if conn:
                connection.put_conn(conn)
                
            return self
        
    def retData(self):
        return self.rows
    
    def retCols(self):
        return self.columns
    
    def retAll(self):
        return self.rows, self.columns
    
    def retDict(self):
        return [dict(zip(self.columns, row)) for row in self.rows] 
    
    def tableCols(self):
        if not hasattr(self, "columns") or not self.columns:
            raise ValueError("Table is not initialized.")
        
        return [col for col in self.columns]