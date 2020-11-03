import pymysql
import json, re
from .constants import USER, PASSWORD, DATABASE, PORT, MAJOR_DICT_PATH, ADDRESS_DICT_PATH
from .utils import get_norm_job_name, get_field_data
from .normalize import PostNormalization
import pandas as pd


class DBPushing:
    def __init__(self):
        self.connection = pymysql.connect(
            host='localhost',
            user=USER,
            password=PASSWORD,
            db=DATABASE,
            charset="utf8mb4",
            cursorclass=pymysql.cursors.DictCursor
        )
        self.cursor = self.connection.cursor()
        self.majors = list(set(json.load(open(MAJOR_DICT_PATH, "r")).values()))
        self.workplaces = list(set(json.load(open(ADDRESS_DICT_PATH, 'r')).values()))
        self.post_normalization = PostNormalization()

    def insert_table(self, table_name, items):
        for item in items:
            self.cursor.execute("INSERT INTO `{}` (`name`) VALUES ('{}')".format(table_name, item))
        self.connection.commit()

    def insert(self, posts, companies):
        post_df = pd.DataFrame(posts)
        company_df = pd.DataFrame(companies)
        company_df = company_df.rename(columns={"description": "company_description", "address": "company_address"})
        merged_data = pd.merge(post_df, company_df, on="company_url")
        merged_data = list(merged_data.T.to_dict().values())
        merged_data = merged_data[:50]

        for post in merged_data:
            post = self.post_normalization.normalize_post(post)
            # print(post)
            title = "'{}'".format(post["title"])
            extra_requirements = "'{}'".format(post["extra_requirements"])
            description = "'{}'".format(post["description"])
            job_benefits = "'{}'".format(post["job_benefits"])
            salary = "'{}'".format(post["salary"])
            job_type = "'{}'".format(post["job_type"])
            valid_through = "'{}'".format(post["valid_through"])
            address = "'{}'".format(post["address"])
            gender = get_field_data(post, "gender")
            experience = get_field_data(post, "experience")
            num_hiring = get_field_data(post, "num_hiring")
            post_url = get_field_data(post, "post_url")
            qualification = get_field_data(post, "qualification")
            position = get_field_data(post, "position")
            contact_name = get_field_data(post, "contact_name")
            majors = post["majors"]
            workplaces = post["workplace"]
            query = "INSERT INTO `{}` \
                (`title`, `extra_requirements`, `description`, `job_benefits`, `salary`, `job_type`, \
                `valid_through`, `address`, `gender`, `experience`, `num_hiring`, `post_url`, `qualification`, `position`, `contact_name`) \
                VALUES ({},{},{},{},{},{},{},{},{},{},{},{},{},{},{})".format("Post", title, extra_requirements, description, job_benefits,
                salary, job_type, valid_through, address, gender, experience, num_hiring, post_url, qualification, position, contact_name)
            self.cursor.execute(query)
            self.connection.commit()
            self.cursor.execute("SELECT * FROM Post ORDER BY postId DESC LIMIT 1")
            last_inserted = self.cursor.fetchone()["postId"]
            major_ids = self.get_table_ids(majors, "Major", "majorId")
            for major_id in major_ids:
                self.cursor.execute("INSERT INTO `MajorPost` (`postId`, `majorId`) VALUES ({},{})".format(last_inserted, major_id))
            workplace_ids = self.get_table_ids(workplaces, "WorkPlace", "workPlaceId")
            for workplace_id in workplace_ids:
                self.cursor.execute("INSERT INTO `WorkPlacePost` (`postId`, `workPlaceId`) VALUES ({}, {})".format(last_inserted, workplace_id))
            company_name = post["name"]
            company_id = self.check_company(company_name)
            if not company_id:
                img = post["img"]
                company_address = post["company_address"]
                company_desc = re.sub(r"(<br>)", "", post["company_description"])
                self.cursor.execute("INSERT INTO `Company` (`name`, `address`, `description`, `img_url`) VALUES ('{}', '{}', '{}', '{}')".format(company_name, company_address, company_desc, img))
                self.connection.commit()
                self.cursor.execute("SELECT * FROM Company ORDER BY companyId DESC LIMIT 1")
                company_id = self.cursor.fetchone()["companyId"]
            self.cursor.execute("INSERT INTO `PostCompany` (`postId`, `companyId`) VALUES ({}, {})".format(last_inserted, company_id))
            self.connection.commit()


    def get_table_ids(self, item_list, table_name, id_field):
        result = []
        for item in item_list:
            self.cursor.execute("SELECT * FROM {} WHERE `name`='{}'".format(table_name, item))
            result.append(self.cursor.fetchone()[id_field])
        return result

    def check_company(self, company_name):
        self.cursor.execute("SELECT * FROM Company WHERE `name`='{}'".format(company_name))
        comp = self.cursor.fetchone()
        if comp:
            return comp["companyId"]
        else: return None

if __name__ == "__main__":
    dbp = DBPushing()
    # dbp.insert_table("Major", dbp.majors)
    # dbp.insert_table("WorkPlace", dbp.workplaces)
    # dbp.get_table_ids(["An ninh – Bảo vệ"], "Major", "majorId")
    posts = json.load(open('./crawler/crawler/data/mywork/post.json', 'r'))
    companies = json.load(open('./crawler/crawler/data/mywork/company.json', 'r'))
    dbp.insert(posts, companies)
    dbp.connection.close()
