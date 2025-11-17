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
    def user_id(self):
        return self.user.get("user_id")

    @user_id.setter
    def user_id(self, value):
        self.user["user_id"] = value

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
    def user_picture(self):
        return self.user.get("user_picture")

    @user_picture.setter
    def user_picture(self, value):
        self.user["user_picture"] = value

    # =================
    # ACTIONS
    # =========

    def get(self, user_id):
        self.user = (
            self.selector
                .table("users")
                .search(tag="user_id", key=user_id)
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

    def edit(self, user_id, updates: dict):
        return (
            self.editor
                .table("users")
                .set(updates)
                .where("user_id", user_id)
                .execute()
        )

    def delete(self, user_id):
        print("Deleting user...")
        self.deleter \
            .table("users") \
            .where("user_id", user_id) \
            .execute()
