from controllers.dbconnection import connection

class Insert():
    def __init__(self):
        self.params         = []
        self.basequery     = "INSERT "
        self.valuesquery   = ""
        self.table_name   = None
        self.tablequery     = ""
        self.columnquery  = ""
        self.columns        = []
    
    def table(self, table):
        self.table_name = table
        self.tablequery = f"INTO {table}"
        self.columns = connection.get_columns(f"{table}")
        self.columnquery = ", ".join([f"{table}.{col}" for col in self.columns])
        return self

    def values(self, data):
        cols = []
        placeholders = []
        self.params = []

        for col, val in data.items():
            cols.append(col)
            placeholders.append("%s")
            self.params.append(val)

        self.columnquery = f"({', '.join(cols)})"
        self.valuesquery = f"VALUES ({', '.join(placeholders)})"
        return self

    
    def execute(self, params = None):
        if params is not None:
            self.params = params
            
        self.query = " ".join([
                    self.basequery,
                    self.tablequery,
                    self.columnquery,
                    self.valuesquery
                    ]).strip()
        print(self.query)

        conn = None
        try:
            conn = connection.get_conn()
            with conn.cursor() as cursor:
                cursor.execute(self.query, self.params)
                conn.commit()
        except Exception as exception:
            print(f"Error selecting : {exception}")
            if conn:
                conn.rollback()
        finally:
            if conn:
                connection.put_conn(conn)