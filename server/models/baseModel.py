from services.Functions.Select import Select

class Model:
    def __init__(self, table, tag = None, key = None, limit = None, offset = None):
        self.selector = Select()
        self.table = table
        self.tag = tag
        self.key = key
        self.limit = limit
        self.offset = offset

    def all(self):
        allContents = self.selector\
                                .table(self.table)\
                                .search(self.tag, self.key)\
                                .execute()\
                                .retDict()
        
        return allContents
    
    def page(self):
        pageContents = self.selector\
                                .table(self.table)\
                                .search(self.tag, self.key)\
                                .limit(self.limit)\
                                .offset(self.offset)\
                                .execute()\
                                .retDict()
        
        return pageContents
    
    def count(self):
        return len(self.all())
    
    def columns(self):
        TableColumns = self.selector\
                            .table(self.table)\
                            .tableCols()
        
        return TableColumns