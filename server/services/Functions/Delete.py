from . import connection

class Delete():
    def __init__(self):
        self.params         = []
        self.basequery      = f"SELECT "
        self.columnquery    = f""
        self.tablequery     = f""
        self.searchquery    = f""
        self.groupquery     = f""
        self.sortquery      = f""
        self.limitquery     = f""
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
    
    def search(self, tag, key, table = None):
        self.searchquery = ""
        self.params = []

        if table is None:
            table = self.table_name
        if tag and key:
            search_tag = self.aliascolumn.get(tag, f"{table}.{tag}")
            self.searchquery = f"WHERE {search_tag} LIKE %s "
            if key == "Male":
                self.params.append(f"{key}")
            else:
                self.params.append(f"%{key}%")

        elif key:            
            searchAll = [f"{col} ILIKE %s" for col in self.columns]
            self.params.extend([f"%{key}%"] * len(self.columns))
            self.searchquery = "WHERE " + " OR ".join(searchAll)
        
        return self
    
    def execute(self, params = None):
        if params is not None:
            self.params = params
            
        self.query = " ".join([
                    self.basequery,
                    self.columnquery,
                    self.tablequery,
                    self.searchquery,
                    self.groupquery,
                    self.sortquery,
                    self.limitquery
                    ]).strip()
        
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