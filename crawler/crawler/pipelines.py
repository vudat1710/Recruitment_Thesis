import json
from .items import TopCVItem, CompanyItem, MajorItem

class CrawlerPipeline(object):
    def __init__(self):
        self.posts = []
        self.companies = []
        self.majors = []
        self.post_file = open('crawler/data/topcv/post.json', 'w')
        self.company_file = open('crawler/data/topcv/company.json', 'w')
        self.major_file = open('crawler/data/topcv/major.json', 'w')

    def close_spider(self, spider):
        json.dump(self.posts, self.post_file)
        json.dump(self.companies, self.company_file)
        json.dump(self.majors, self.major_file)
        self.post_file.close()
        self.company_file.close()
        self.major_file.close()

    def process_item(self, item, spider): 
        if isinstance(item, TopCVItem):       
            self.posts.append(dict(item))
        elif isinstance(item, CompanyItem):
            self.companies.append(dict(item))
        elif isinstance(item, MajorItem):
            self.majors.append(dict(item))
        
        return item
