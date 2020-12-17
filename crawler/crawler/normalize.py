import re, json
from .constants import MAJOR_DICT_PATH, ADDRESS_DICT_PATH, EXP_DICT_PATH, JOB_TYPE_DICT_PATH
from .utils import get_norm_job_name
from datetime import datetime
from underthesea import word_tokenize

class PostNormalization:
    def __init__(self):
        self.major_dict = json.load(open(MAJOR_DICT_PATH, "r"))
        self.address_dict = json.load(open(ADDRESS_DICT_PATH, "r"))
        self.exp_dict = json.load(open(EXP_DICT_PATH, "r"))
        self.job_type_dict = json.load(open(JOB_TYPE_DICT_PATH, "r"))
        self.qualification_list = [x.lower() for x in ['Cao đẳng', 'Chứng chỉ', 'Đại học', 'Trung học', 'Trung cấp', 'Lao động phổ thông', 'Cao học']]
        self.salary_type_list = [(1,3), (3,5), (5,7), (7,10), (10,12), (12,15), (15,20), (20,25), (25,30)]

    def normalize_post(self, post):
        if post["valid_through"] == "" or post["job_type"] == "" or post["workplace"] == "":
            return None
        post['workplace'] = self.normalize_workplace(post["workplace"])
        post['majors'] = self.normalize_majors(post['majors'])
        # post['title'] = re.sub(
        #     r"(\\(.+\\)|\\[.+\\]|{.+}|–.+|-.*|,.*|Thu Nhập.*|Khu Vực.*|Làm Việc Tại.*|Lương.*|\d{1,2}[ ]{0,1}-[ ]{0,1}\d{1,2}.*)",
        #     '', post['title']).strip()
        post["min_value"], post["max_value"], post['salary_type'] = self.normalize_salary(post['salary'])
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
        post["gender"] = self.normalize_gender(post["gender"])
        post["job_type"] = self.normalize_job_type(post["job_type"])
        post["experience"] = self.normalize_experience(post["experience"])
        if post["qualification"] != "":
            if post["qualification"] == "Trên đại học":
                post["qualification"] = "Cao học"
            elif post["qualification"] == "Tất cả trình độ":
                post["qualification"] = "Không yêu cầu"
            post["qualification"].lower()
        else:
            post["qualification"] = self.get_qualification(post["extra_requirements"])

        return post

    def get_qualification(self, extra_requirements):
        word_list = word_tokenize(extra_requirements.lower())
        qualification = [x.capitalize() for x in word_list if x in self.qualification_list]
        if len(qualification) == 0:
            return "không yêu cầu".capitalize()
        else: return ", ".join(list(set(qualification)))

    def normalize_gender(self, gender):
        if "Không" in gender or gender == "":
            return "Không yêu cầu"
        else:
            return gender

    def normalize_job_type(self, job_type):
        if job_type in self.job_type_dict:
            return self.job_type_dict[job_type]
        else: return job_type

    def normalize_experience(self, experience):
        return self.exp_dict[experience]

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
        salary = salary.split("(")[0].strip()
        if re.match(r"^((\d{1,3}([\.,]\d{3})+))", str(salary)) is not None:
            salary = re.sub(r'[.,]', '', str(salary))
            if "-" in salary:
                salary = [int(x.strip()) for x in salary.split("-")]
        else:
            value_list = re.findall(r'\d+', salary)
            if len(value_list) > 0:
                salary = [int(x) * 1000000 for x in value_list]
        if salary in ["Thoả thuận", "Thỏa thuận"]:
            return (0,0,"Thoả thuận")
        elif len(salary) == 1:
            return [salary[0], salary[0], self.get_salary_type(salary[0] / 1000000)]
        else:
            return [salary[0], salary[1], self.get_salary_type(salary[0] / 1000000)]
    
    def normalize_long_text(self, long_text):
        long_text = long_text.replace("\\\\\\'", "''")
        return long_text.replace("'", "''")

    def get_salary_type(self, min_value):
        if min_value < 30:
            for pair in self.salary_type_list:
                if pair[0] <= min_value <= pair[1]:
                    return "{}-{} triệu".format(pair[0], pair[1])
        return "Trên 30 triệu"