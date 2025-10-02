from models.baseModel import Model
from services.Functions import Insert, Select

class Student(Model):
    def __init__(self, table="students", tag=None, key=None, limit=None, offset=None):
        super().__init__(table, tag, key, limit, offset)
        self.selector = Select.Select()
        self.insertor = Insert.Insert()
        self.student = {}  

    def get(self, id_number):
        self.student = (
            self.selector
            .table("students")
            .search(tag="id_number", key=id_number)
            .execute()
            .retDict()
        )
        return self.student

    # ====================
    # PROPERTIES
    # ========
    @property
    def id_number(self):
        return self.student.get("id_number")

    @id_number.setter
    def id_number(self, value):
        self.student["id_number"] = value
    
    @property
    def first_name(self):
        return self.student.get("first_name")

    @first_name.setter
    def first_name(self, value):
        self.student["first_name"] = value

    @property
    def middle_name(self):
        return self.student.get("middle_name")

    @middle_name.setter
    def middle_name(self, value):
        self.student["middle_name"] = value

    @property
    def last_name(self):
        return self.student.get("last_name")

    @last_name.setter
    def last_name(self, value):
        self.student["last_name"] = value

    @property
    def gender(self):
        return self.student.get("gender")

    @gender.setter
    def gender(self, value):
        self.student["gender"] = value

    @property
    def year_level(self):
        return self.student.get("year_level")

    @year_level.setter
    def year_level(self, value):
        self.student["year_level"] = value

    @property
    def program_code(self):
        return self.student.get("program_code")

    @program_code.setter
    def program_code(self, value):
        self.student["program_code"] = value

    def add(self):
        self.insertor\
            .table("students")\
            .values(self.student)\
            .execute
        
    def edit(self):
        pass