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

        if self.table_name == "students":
            full_expr = (
                f"TRIM({table}.first_name || ' ' || "
                f"COALESCE({table}.middle_name || ' ', '') || "
                f"{table}.last_name)"
            )

            self.columnquery = ", ".join(
                [f"{table}.{col}" for col in self.columns] +
                [f"{full_expr} AS full_name"]
            )

            self.columns = self.columns + ["full_name"]

            self.aliascolumn["name"] = full_expr 
            self.aliascolumn["full_name"] = full_expr
        
        else:
            self.columnquery = ", ".join(
                [f"{table}.{col}" for col in self.columns]
            )
    
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
    
    def search(self, tag = None, key = None, table = None, search_mult = None, connector = "AND"):
        self.searchquery = ""
        self.params = []

        if table is None:
            table = self.table_name

        if search_mult is None:
            search_mult = {}

        excluded = {"id_picture", "first_name", "middle_name", "last_name"}

        usable_columns = [c for c in self.columns if c not in excluded]

        fullname_expr = f"{self.aliascolumn.get('name')}"

        conditions = []

        for col, val in search_mult.items():
            if val in (None, ""):
                continue

            search_tag = self.aliascolumn.get(col, f"{table}.{col}")

            if col == "year_level" or (col == "id_number" and self.table_name == "users"):
                if val == 0: 
                    continue
                else:
                    conditions.append(f"{search_tag} = %s")
                    self.params.append(int(val))

            elif col == "id_picture":
                continue

            elif val == "Male":  
                conditions.append(f"{search_tag} = %s")
                self.params.append(val)

            elif col == "name":
                conditions.append(f"LOWER({fullname_expr}) LIKE LOWER(%s)")
                self.params.append(f"%{val.strip()}%")

            else:
                conditions.append(f"{search_tag} ILIKE %s")
                self.params.append(f"%{val}%")

        if tag and key not in (None, ""):
            search_tag = self.aliascolumn.get(tag, f"{table}.{tag}")

            if tag == "year_level" or (tag == "id_number" and self.table_name == "users"):
                if key == 0:
                    pass
                else:
                    conditions.append(f"{search_tag} = %s")
                    self.params.append(int(key))
                
            elif search_tag == "id_picture":
                pass

            elif key == "Male":
                conditions.append(f"{search_tag} = %s")
                self.params.append(key)

            elif tag == "name":
                conditions.append(f"LOWER({fullname_expr}) LIKE LOWER(%s)")
                self.params.append(f"%{key.strip()}%")
                print("SEARCHING PRINT NAME: ", tag, key)

            else:
                conditions.append(f"{search_tag} ILIKE %s")
                self.params.append(f"%{key}%")

        elif key not in (None, ""):
            global_cond = []
            connector = "OR"

            for col in usable_columns:
                col_tag = f"{table}.{col}"

                if self.table_name == "students" and col in ["program_code", "college_code", "year_level", "gender", "email"]:
                    continue

                elif col in ("year_level",) or (col == "id_number" and self.table_name == "users"):
                    if str(key).isdigit():
                        if key == 0:
                            pass
                        else:
                            global_cond.append(f"{col_tag} = %s")
                            self.params.append(int(key))
                    else:
                        continue
                
                elif col == "full_name":
                    conditions.append(f"LOWER({fullname_expr}) LIKE LOWER(%s)")
                    self.params.append(f"%{key.strip()}%")
                    
                else:
                    global_cond.append(f"{col_tag} ILIKE %s")
                    self.params.append(f"%{key}%")

            if global_cond:
                conditions.extend(global_cond)

        if conditions:
            self.searchquery = "WHERE " + f" {connector} ".join(conditions)
        else:
            self.searchquery = ""

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