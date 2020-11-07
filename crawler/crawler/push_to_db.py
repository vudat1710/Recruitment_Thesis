import pymysql
import json, re
from .constants import USER, PASSWORD, DATABASE, MAJOR_DICT_PATH, ADDRESS_DICT_PATH
from .utils import get_field_data, get_post_to_check, merge_data
from .normalize import PostNormalization
import pandas as pd
from collections import OrderedDict
from .filtering import DuplicateFiltering

CHUNK_SIZE = 100

class DBPushing:
    def __init__(self, merged_data):
        self.connection = pymysql.connect(
            host='localhost',
            user=USER,
            password=PASSWORD,
            db=DATABASE,
            charset="utf8mb4",
            cursorclass=pymysql.cursors.DictCursor
        )
        self.cursor = self.connection.cursor()
        print("Connect to DB successfully!\n")
        self.majors = list(set(json.load(open(MAJOR_DICT_PATH, "r")).values()))
        self.workplaces = list(set(json.load(open(ADDRESS_DICT_PATH, 'r')).values()))
        self.post_normalization = PostNormalization()
        self.num_duplicated = 0
        self.merged_data = merged_data

    def insert_table(self, table_name, items):
        for item in items:
            self.cursor.execute("INSERT INTO `{}` (`name`) VALUES ('{}')".format(table_name, item))
        self.connection.commit()

    def check_posts(self, merged_data):
        duplicate_filtering = self.get_filtered_data()
        if duplicate_filtering:
            result = []
            for post in merged_data:
                post_to_check = get_post_to_check(post)
                if duplicate_filtering.is_match(post_to_check):
                    self.num_duplicated += 1
                else:
                    result.append(post)
            return result
        else:
            return merged_data
        # else:
        #     data = self.merged_data.copy()
        #     for post in self.merged_data.copy():
        #         data.remove(post)
        #         self.duplicate_filtering = DuplicateFiltering(3, [get_post_to_check(post) for post in data])
        #         if self.duplicate_filtering.is_match(get_post_to_check(post)):
        #             print(post)
        #             self.merged_data.remove(post)
        #     return self.merged_data

    def insert_to_db(self, posts_with_company):
        for post in posts_with_company:
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
            workplaces = post["workplace"].split(",")
            query = "INSERT INTO `{}` \
                (`title`, `extra_requirements`, `description`, `job_benefits`, `salary`, `job_type`, \
                `valid_through`, `address`, `gender`, `experience`, `num_hiring`, `post_url`, `qualification`, `position`, `contact_name`) \
                VALUES ({},{},{},{},{},{},{},{},{},{},{},{},{},{},{})".format("Post", title, extra_requirements, description, job_benefits,
                salary, job_type, valid_through, address, gender, experience, num_hiring, post_url, qualification, position, contact_name)
            self.cursor.execute(query)
            self.connection.commit()
            self.cursor.execute("SELECT * FROM Post ORDER BY postId DESC LIMIT 1")
            last_inserted = self.cursor.fetchone()["postId"]
            workplace_ids = self.get_table_ids(workplaces, "WorkPlace", "workPlaceId")
            for workplace_id in workplace_ids:
                self.cursor.execute("INSERT INTO `WorkPlacePost` (`postId`, `workPlaceId`) VALUES ({}, {})".format(last_inserted, workplace_id))
            major_ids = self.get_table_ids(majors, "Major", "majorId")
            for major_id in major_ids:
                self.cursor.execute("INSERT INTO `MajorPost` (`postId`, `majorId`) VALUES ({},{})".format(last_inserted, major_id))
            company_name = post["name"].replace("'", "''")
            company_id = self.check_company(company_name)
            if not company_id:
                img = post["img"]
                if "company_address" in post.keys():
                    company_address = post["company_address"]
                else:
                    company_address = address[1:-1]
                company_desc = post["company_description"]
                company_query = "INSERT INTO `Company` (`name`, `address`, `description`, `img_url`) VALUES ('{}', '{}', '{}', '{}')".format(company_name, company_address, company_desc, img)
                self.cursor.execute(company_query)
                self.connection.commit()
                self.cursor.execute("SELECT * FROM Company ORDER BY companyId DESC LIMIT 1")
                company_id = self.cursor.fetchone()["companyId"]
            self.cursor.execute("INSERT INTO `PostCompany` (`postId`, `companyId`) VALUES ({}, {})".format(last_inserted, company_id))
            self.connection.commit()
        print("Insert successfully {} posts!\n".format(len(posts_with_company)))

    def push_chunks(self):
        for i in range(len(self.merged_data) // CHUNK_SIZE + 1):
            posts_with_company = self.check_posts(self.merged_data[(CHUNK_SIZE*i):(CHUNK_SIZE*(i+1))])
            print(len(posts_with_company))
            self.insert_to_db(posts_with_company)

    def get_table_ids(self, item_list, table_name, id_field):
        query = "SELECT * FROM {} WHERE `name` IN (".format(table_name)
        for i in range(len(item_list)):
            query += "'{}',".format(item_list[i])
            if i == len(item_list) - 1:
                query = query[:-1] + ")"
        self.cursor.execute(query)
        result = self.cursor.fetchall()
        return [x[id_field] for x in result]

    def check_company(self, company_name):
        self.cursor.execute("SELECT * FROM Company WHERE `name`='{}'".format(company_name))
        comp = self.cursor.fetchone()
        if comp:
            return comp["companyId"]
        else: return None
    
    def get_filtered_data(self):
        query = "SELECT `title`, `Company`.`name`, `WorkPlace`.`name` \
        FROM Post, Company, PostCompany, WorkPlace, WorkPlacePost \
        WHERE `Post`.`postId` = `PostCompany`.`postId` \
        AND `Post`.`postId` = `WorkPlacePost`.`postId` \
        AND `Company`.`companyId` = `PostCompany`.`companyId` \
        AND `WorkPlace`.`workPlaceId` = `WorkPlacePost`.`workPlaceId`"
        extra_q = "(SELECT `postId` from WorkPlacePost \
        GROUP BY `postId` \
        HAVING COUNT(`postId`) > 1)"
        self.cursor.execute(query + " AND `PostCompany`.`postId` NOT IN " + extra_q)
        posts_one_place = self.cursor.fetchall()
        posts_one_place = [[x['title'], x['name'], x['WorkPlace.name']] for x in posts_one_place]
        self.cursor.execute(query + " AND `PostCompany`.`postId` IN " + extra_q)
        posts_other = self.cursor.fetchall()
        d = OrderedDict()
        for post in posts_other:
            d.setdefault((post['title'], post['name']), set()).add(post['WorkPlace.name'])
        filtered_data = [[k[0], k[1], v.pop() if len(v) == 1 else v] for k, v in d.items()]
        filtered_data = [[x[0], x[1], ",".join(x[2]) if isinstance(x[2], set) else x[2]] for x in filtered_data]
        filtered_data.extend(posts_one_place)
        if len(filtered_data) > 0:
            return DuplicateFiltering(3, filtered_data)
        else:
            return None
        

if __name__ == "__main__":
     
    # dbp.get_table_ids(["An ninh – Bảo vệ"], "Major", "majorId")
    posts = json.load(open('./crawler/data/topcv/post.json', 'r'))
    companies = json.load(open('./crawler/data/topcv/company.json', 'r'))
    merged_data = []
    post_normalization = PostNormalization()
    for post in merge_data(posts, companies):
        norm_post = post_normalization.normalize_post(post)
        if norm_post:
            merged_data.append(norm_post)
    dbp = DBPushing(merged_data)
    # dbp.insert_table("Major", dbp.majors)
    # dbp.insert_table("WorkPlace", dbp.workplaces)
    dbp.push_chunks()
    dbp.connection.close()
