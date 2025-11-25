from models.baseModel import Model
from services.Functions import Insert, Select, Update, Delete

class User(Model):
    def __init__(self, table="users", tag=None, key=None, limit=None, offset=None):
        super().__init__(table, tag, key, limit, offset)
        self.selector = Select.Select()
        self.insertor = Insert.Insert()
        self.editor    = Update.Update()
        self.deleter   = Delete.Delete()
        self.user = {}

    # ==================
    # PROPERTIES
    # =========

    @property
    def id_number(self):
        return self.user.get("id_number")

    @id_number.setter
    def id_number(self, value):
        self.user["id_number"] = value

    @property
    def user_name(self):
        return self.user.get("user_name")

    @user_name.setter
    def user_name(self, value):
        self.user["user_name"] = value

    @property
    def user_password(self):
        return self.user.get("user_password")

    @user_password.setter
    def user_password(self, value):
        self.user["user_password"] = value

    @property
    def user_email(self):
        return self.user.get("user_email")

    @user_email.setter
    def user_email(self, value):
        self.user["user_email"] = value

    @property
    def id_picture(self):
        return self.user.get("id_picture")

    @id_picture.setter
    def id_picture(self, value):
        self.user["id_picture"] = value

    # =================
    # ACTIONS
    # =========

    def get(self, id_number):
        self.user = (
            self.selector
                .table("users")
                .search(tag="id_number", key=id_number)
                .execute()
                .retDict()
        )
        return self.user

    def add(self, data: dict):
        print("Inserting user...")
        self.insertor \
            .table("users") \
            .values(data) \
            .execute()

    def edit(self, id_number, updates: dict):
        return (
            self.editor
                .table("users")
                .set(updates)
                .where("id_number", id_number)
                .execute()
        )

    def delete(self, id_number):
        print("Deleting user...")
        self.deleter \
            .table("users") \
            .where("id_number", id_number) \
            .execute()
