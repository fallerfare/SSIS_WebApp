from models.baseModel import Model
from services.Functions import Insert, Select, Update, Delete

class Program(Model):
    def __init__(self, table="programs", tag = None, key = None, limit = None, offset = None):
        super().__init__(table, tag, key, limit, offset)
        self.selector = Select.Select()
        self.insertor = Insert.Insert()
        self.editor    = Update.Update()
        self.deleter  = Delete.Delete()
        self.program = {}  

    def get(self, program_code):
        self.program = (
            self.selector
            .table("programs")
            .search(tag="program_code", key=program_code)
            .execute()
            .retDict()
        )
        return self.program

    # ====================
    # PROPERTIES
    # ========
    @property
    def program_code(self):
        return self.program.get("program_code")

    @program_code.setter
    def program_code(self, value):
        self.program["program_code"] = value

    @property
    def program_name(self):
        return self.program.get("program_name")

    @program_name.setter
    def program_name(self, value):
        self.program["program_name"] = value

    @property
    def college_code(self):
        return self.program.get("college_code")

    @college_code.setter
    def college_code(self, value):
        self.program["college_code"] = value

    # ====================
    # ACTIONS
    # ========

    def get(self, program_code):
        self.student = (
            self.selector
            .table("programs")
            .search(tag="program_code", key=program_code)
            .execute()
            .retDict()
        )
        return self.student
    
    def add(self, data: dict):
        print("Inserting...")
        self.insertor\
            .table("programs")\
            .values(data)\
            .execute()
         
    def edit(self, program_code, updates: dict):
        return (
            self.editor
            .table("programs")
            .set(updates)
            .where("program_code", program_code)
            .execute()
        )
        
    def delete(self, program_code):
        print("Deleting...")
        self.deleter\
            .table("programs")\
            .where("program_code", program_code)\
            .execute()
