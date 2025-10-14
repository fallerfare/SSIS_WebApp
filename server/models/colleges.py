from models.baseModel import Model
from services.Functions import Insert, Select, Update, Delete

class College(Model):
    def __init__(self, table="colleges", tag = None, key = None, limit = None, offset = None):
        super().__init__(table, tag, key, limit, offset)
        self.selector = Select.Select()
        self.insertor = Insert.Insert()
        self.editor    = Update.Update()
        self.deleter  = Delete.Delete()
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

    # ====================
    # ACTIONS
    # ========

    def get(self, college_code):
        self.student = (
            self.selector
            .table("colleges")
            .search(tag="college_code", key=college_code)
            .execute()
            .retDict()
        )
        return self.student
    
    def add(self, data: dict):
        print("Inserting...")
        self.insertor\
            .table("colleges")\
            .values(data)\
            .execute()
         
    def edit(self, college_code, updates: dict):
        return (
            self.editor
            .table("colleges")
            .set(updates)
            .where("college_code", college_code)
            .execute()
        )
        
    def delete(self, college_code):
        print("Deleting...")
        self.deleter\
            .table("colleges")\
            .where("college_code", college_code)\
            .execute()
