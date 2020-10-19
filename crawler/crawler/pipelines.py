import json
from .items import *

class CrawlerPipeline(object):
    def __init__(self):
        #topcv
        self.posts = []
        self.companies = []
        self.majors = []

        #vieclam24h
        self.posts_vl24 = []
        self.companies_vl24 = []
        self.majors_vl24 = []

        #mywork
        self.posts_mw = []
        self.companies_mw = []
        self.majors_mw = []

        #timviecnhanh
        self.posts_tvn = []
        self.companies_tvn = []
        self.majors_tvn = []

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
        if len(self.posts_mw) != 0:
            json.dump(self.posts_mw, open('crawler/data/mywork/post.json', 'w'))
        if len(self.companies_mw) != 0:
            json.dump(self.companies_mw, open('crawler/data/mywork/company.json', 'w'))
        if len(self.majors_mw) != 0:
            json.dump(self.majors_mw, open('crawler/data/mywork/major.json', 'w'))
        if len(self.posts_tvn) != 0:
            json.dump(self.posts_tvn, open('crawler/data/timviecnhanh/post.json', 'w'))
        if len(self.companies_tvn) != 0:
            json.dump(self.companies_tvn, open('crawler/data/timviecnhanh/company.json', 'w'))
        if len(self.majors_tvn) != 0:
            json.dump(self.majors_tvn, open('crawler/data/timviecnhanh/major.json', 'w'))

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
        elif isinstance(item, MyWorkItem):       
            self.posts_mw.append(dict(item))
        elif isinstance(item, MyWorkCompanyItem):
            self.companies_mw.append(dict(item))
        elif isinstance(item, MyWorkMajorItem):
            self.majors_mw.append(dict(item))
        elif isinstance(item, TVNItem):       
            self.posts_tvn.append(dict(item))
        elif isinstance(item, TVNCompanyItem):
            self.companies_tvn.append(dict(item))
        elif isinstance(item, TVNMajorItem):
            self.majors_tvn.append(dict(item))
        
        return item
