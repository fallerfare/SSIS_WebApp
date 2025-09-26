from baseModel import Model

class College(Model):
    def __init__(self, table, tag = None, key = None, limit = None, offset = None):
        super().__init__(table, tag, key, limit, offset)