import json
from .items import TopCVItem, CompanyItem, MajorItem, ViecLam24hItem, VL24hCompanyItem, VL24hMajorItem

class CrawlerPipeline(object):
    def __init__(self):
        self.posts = []
        self.companies = []
        self.majors = []

        self.posts_vl24 = []
        self.companies_vl24 = []
        self.majors_vl24 = []

    def close_spider(self, spider):
        if len(self.posts) != 0:
            json.dump(self.posts, open('crawler/data/topcv/post.json', 'w'))
        if len(self.companies) != 0:
            json.dump(self.companies, open('crawler/data/topcv/company.json', 'w'))
        if len(self.majors) != 0:
            json.dump(self.majors, open('crawler/data/topcv/major.json', 'w'))
        if len(self.posts_vl24) != 0:
            json.dump(self.posts_vl24, open('crawler/data/vieclam24h/post.json', 'w'))
        if len(self.companies_vl24) != 0:
            json.dump(self.companies_vl24, open('crawler/data/vieclam24h/company.json', 'w'))
        if len(self.majors_vl24) != 0:
            json.dump(self.majors_vl24, open('crawler/data/vieclam24h/major.json', 'w'))

    def process_item(self, item, spider): 
        if isinstance(item, TopCVItem):       
            self.posts.append(dict(item))
        elif isinstance(item, CompanyItem):
            self.companies.append(dict(item))
        elif isinstance(item, MajorItem):
            self.majors.append(dict(item))
        elif isinstance(item, ViecLam24hItem):       
            self.posts_vl24.append(dict(item))
        elif isinstance(item, VL24hCompanyItem):
            self.companies_vl24.append(dict(item))
        elif isinstance(item, VL24hMajorItem):
            self.majors_vl24.append(dict(item))
        
        return item
