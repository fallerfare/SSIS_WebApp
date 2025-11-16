from models.baseModel import Model
from services.Functions import Insert, Select, Update, Delete

class User(Model):
    def __init__(self, table="users", tag = None, key = None, limit = None, offset = None):
        super().__init__(table, tag, key, limit, offset)
        self.selector = Select.Select()
        self.insertor = Insert.Insert()
        self.editor    = Update.Update()
        self.deleter  = Delete.Delete()
        self.user = {}  

    # ====================
    # PROPERTIES
    # ========
    @property
    def username(self):
        return self.user.get("username")

    @username.setter
    def username(self, value):
        self.user["username"] = value

    @property
    def email(self):
        return self.user.get("email")

    @email.setter
    def email(self, value):
        self.user["email"] = value

    @property
    def password(self):
        return self.user.get("password")

    @password.setter
    def password(self, value):
        self.user["password"] = value

    # ====================
    # ACTIONS
    # ========

    def getID(self, user_id: int):
        self.user = (
            self.selector
            .table("users")
            .search(tag="user_id", key=user_id)
            .execute()
            .retDict()
        )
        return self.user
    
    def getEmail(self, user_email: str):
        self.user = (
            self.selector
            .table("users")
            .search(tag="user_email", key=user_email)
            .execute()
            .retDict()
        )
        return self.user
    
    def getName(self, user_name: str):
        self.user = (
            self.selector
            .table("users")
            .search(tag="user_name", key=user_name)
            .execute()
            .retDict()
        )
        return self.user
    
    def add(self, data: dict):
        print("Inserting...")
        self.insertor\
            .table("users")\
            .values(data)\
            .execute()
         
    def edit(self, user_id, updates: dict):
        return (
            self.editor
            .table("users")
            .set(updates)
            .where("user_id", user_id)
            .execute()
        )
        
    def delete(self, user_id):
        print("Deleting...")
        self.deleter\
            .table("users")\
            .where("user_id", user_id)\
            .execute()
