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
    valid_through = Field()
    salary = Field()
    job_type = Field()
    num_hiring = Field()
    position = Field()
    experience = Field()
    gender = Field()
    img = Field()
    workplace = Field()
    description = Field()
    extra_requirements = Field()
    job_benefits = Field()
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
    valid_through = Field()
    salary = Field()
    job_type = Field()
    num_hiring = Field()
    position = Field()
    experience = Field()
    gender = Field()
    img = Field()
    workplace = Field()
    description = Field()
    extra_requirements = Field()
    job_benefits = Field()
    majors = Field()
    qualification = Field()
    company_url = Field()
    contact_name = Field()
    post_url = Field()

class VL24hCompanyItem(Item):
    name = Field()
    description = Field()
    company_url = Field()
    address = Field()

class VL24hMajorItem(Item):
    name = Field()
    major_url = Field()

#Mywork
class MyWorkItem(Item):
    title = Field()
    company_title = Field()
    address = Field()
    valid_through = Field()
    salary = Field()
    job_type = Field()
    num_hiring = Field()
    position = Field()
    experience = Field()
    gender = Field()
    img = Field()
    workplace = Field()
    description = Field()
    extra_requirements = Field()
    job_benefits = Field()
    majors = Field()
    qualification = Field()
    contact_name = Field()
    company_url = Field()
    post_url = Field()

class MyWorkCompanyItem(Item):
    name = Field()
    description = Field()
    company_url = Field()
    address = Field()

class MyWorkMajorItem(Item):
    name = Field()
    major_url = Field()

#Timviecnhanh
class TVNItem(Item):
    title = Field()
    company_title = Field()
    address = Field()
    valid_through = Field()
    salary = Field()
    job_type = Field()
    num_hiring = Field()
    position = Field()
    experience = Field()
    gender = Field()
    img = Field()
    workplace = Field()
    description = Field()
    extra_requirements = Field()
    job_benefits = Field()
    majors = Field()
    qualification = Field()
    contact_name = Field()
    company_url = Field()
    post_url = Field()

class TVNCompanyItem(Item):
    name = Field()
    description = Field()
    company_url = Field()
    address = Field()

class TVNMajorItem(Item):
    name = Field()
    major_url = Field()

#Viectotnhat
class VTNItem(Item):
    title = Field()
    company_title = Field()
    address = Field()
    valid_through = Field()
    salary = Field()
    job_type = Field()
    num_hiring = Field()
    position = Field()
    experience = Field()
    gender = Field()
    img = Field()
    workplace = Field()
    description = Field()
    extra_requirements = Field()
    job_benefits = Field()
    majors = Field()
    qualification = Field()
    contact_name = Field()
    company_url = Field()
    post_url = Field()

class VTNCompanyItem(Item):
    name = Field()
    description = Field()
    company_url = Field()
    address = Field()

class VTNMajorItem(Item):
    name = Field()
    major_url = Field()