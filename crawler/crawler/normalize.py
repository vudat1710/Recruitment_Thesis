import re, json
from .constants import MAJOR_DICT_PATH, ADDRESS_DICT_PATH
from .utils import get_norm_job_name
from datetime import datetime

class PostNormalization:
    def __init__(self):
        self.major_dict = json.load(open(MAJOR_DICT_PATH, "r"))
        self.address_dict = json.load(open(ADDRESS_DICT_PATH, "r"))

    def normalize_post(self, post):
        if post["valid_through"] == "":
            return None
        post['workplace'] = self.normalize_workplace(post["workplace"])
        post['majors'] = self.normalize_majors(post['majors'])
        post['title'] = re.sub(
            r"(\\(.+\\)|\\[.+\\]|{.+}|–.+|-.*|,.*|Thu Nhập.*|Khu Vực.*|Làm Việc Tại.*|Lương.*|\d{1,2}[ ]{0,1}-[ ]{0,1}\d{1,2}.*)",
            '', post['title']).strip()
        post['salary'] = self.normalize_salary(post['salary'])
        post['description'] = re.sub(r"(<br>)", "", post['description']) 
        post['valid_through'] = self.normalize_date(post['valid_through'])
        post['description'] = self.normalize_long_text(post['description'])
        post['job_benefits'] = self.normalize_long_text(post['job_benefits'])
        post['extra_requirements'] = self.normalize_long_text(post['extra_requirements'])
        post['company_description'] = re.sub(r"(<br>)", "", post['company_description'])
        post['company_description'] = self.normalize_long_text(post['company_description'])
        if "company_address" in post:
            post["company_address"] = self.normalize_long_text(post["company_address"])
        post["address"] = self.normalize_long_text(post["address"])

        return post

    def normalize_date(self, date):
        try:
            date = re.search(r"\d{2}[-/]\d{2}[-/]\d{4}", date).group(0)
        except:
            date = ""
        try:
            return datetime.strptime(date, "%d/%m/%Y").strftime('%Y-%m-%d')
        except:
            return datetime.strptime(date, "%d-%m-%Y").strftime('%Y-%m-%d')

    def normalize_majors(self, category):
        norm_category = []
        if isinstance(category, list):
            for items in category:
                norm_category.extend(get_norm_job_name(items, self.major_dict))
        else:
            norm_category.extend(get_norm_job_name(category, self.major_dict))

        if len(norm_category) == 0:
            norm_category.append('Khác')

        return list(set(norm_category))

    def normalize_workplace(self, workplace_post):       
        if isinstance(workplace_post, list):
            workplace_post = [self.address_dict[w.strip()] for w in workplace_post]
            return ','.join(workplace_post)
        else:
            norm_workplace = []
            workplaces = [x.strip() for x in workplace_post.split(",")]
            for workplace in workplaces:
                norm_workplace.append(self.address_dict[workplace])
            return ','.join(list(set(norm_workplace)))

    def normalize_salary(self, salary):
        if re.match(r"^((\d{1,3}([\.,]\d{3})+))", str(salary)) is not None:
            return re.sub(r'[.,]', '', str(salary))
        else:
            value_list = re.findall(r'\d+', salary)
            if len(value_list) > 0:
                return "-".join([str(int(x) * 1000000) for x in value_list])
        return salary
    
    def normalize_long_text(self, long_text):
        long_text = long_text.replace("\\\\\\'", "''")
        return long_text.replace("'", "''")