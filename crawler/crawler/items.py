# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

from scrapy import Field, Item

#TopCV
class TopCVItem(Item):
    title = Field()
    company_title = Field()
    address = Field()
    job_deadline = Field()
    salary = Field()
    job_type = Field()
    num_hiring = Field()
    position = Field()
    experience = Field()
    gender = Field()
    img = Field()
    workplace = Field()
    description = Field()
    requirements = Field()
    extra = Field()
    majors = Field()
    company_url = Field()
    post_url = Field()

class CompanyItem(Item):
    name = Field()
    description = Field()
    company_url = Field()

class MajorItem(Item):
    name = Field()
    major_url = Field()


#Vieclam24h
class ViecLam24hItem(Item):
    title = Field()
    company_title = Field()
    address = Field()
    job_deadline = Field()
    salary = Field()
    job_type = Field()
    num_hiring = Field()
    position = Field()
    experience = Field()
    gender = Field()
    img = Field()
    workplace = Field()
    description = Field()
    requirements = Field()
    extra = Field()
    majors = Field()
    level = Field()
    company_url = Field()
    post_url = Field()

class VL24hCompanyItem(Item):
    name = Field()
    description = Field()
    company_url = Field()
    address = Field()

class VL24hMajorItem(Item):
    name = Field()
    major_url = Field()