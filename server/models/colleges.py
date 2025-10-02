from models.baseModel import Model
from services.Functions import Insert, Select

class College(Model):
    def __init__(self, table="colleges", tag = None, key = None, limit = None, offset = None):
        super().__init__(table, tag, key, limit, offset)
        self.selector = Select.Select()
        self.insertor = Insert.Insert()
        self.college = {}  

    def get(self, college_code):
        self.college = (
            self.selector
            .table("colleges")
            .search(tag="college_code", key=college_code)
            .execute()
            .retDict()
        )
        return self.college

    # ====================
    # PROPERTIES
    # ========
    @property
    def college_code(self):
        return self.college.get("college_code")

    @college_code.setter
    def college_code(self, value):
        self.college["college_code"] = value

    @property
    def college_name(self):
        return self.college.get("college_name")

    @college_name.setter
    def college_name(self, value):
        self.college["college_name"] = value

    def add(self):
        self.insertor\
            .table("colleges")\
            .values(self.college)\
            .execute
        
    def edit(self):
        pass