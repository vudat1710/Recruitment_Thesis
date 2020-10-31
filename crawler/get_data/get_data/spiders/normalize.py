import re, json
from ..constants import MAJOR_DICT_PATH, ADDRESS_DICT_PATH
from ..utils import get_norm_job_name


class PostNormalization:
    def __init__(self):
        self.major_dict = json.load(open(MAJOR_DICT_PATH, "r"))
        self.address_dict = json.load(open(ADDRESS_DICT_PATH, "r"))

    def normalize_post(self, post):
        post['jobLocation']['address']['addressRegion'] = self.address_dict[post['jobLocation']['address']['addressRegion']]
        post['occupationalCategory'] = self.normalize_occupational_category(post['occupationalCategory'])
        post['title'] = re.sub(
            r"(\\(.+\\)|\\[.+\\]|{.+}|–.+|-.*|,.*|Thu Nhập.*|Khu Vực.*|Làm Việc Tại.*|Lương.*|\d{1,2}[ ]{0,1}-[ ]{0,1}\d{1,2}.*)",
            '', post['title']).strip()
        post['baseSalary']['minValue'] = self.normalize_salary(post['baseSalary']['minValue'])
        post['baseSalary']['maxValue'] = self.normalize_salary(post['baseSalary']['maxValue'])

        return post

    def normalize_occupational_category(self, category):
        norm_category = []
        if isinstance(category, list):
            for items in category:
                norm_category.extend(get_norm_job_name(items, self.major_dict))
        else:
            norm_category.extend(get_norm_job_name(category, self.major_dict))

        if len(norm_category) == 0:
            norm_category.append('Khác')

        return list(set(norm_category))

    def normalize_salary(self, salary):
        if re.match(r"^(((\d{1,3}([\.,]\d{3})*)|(\d+))|(\w*\d+))$", str(salary)) is not None:
            return int(re.sub(r'[.,]', '', str(salary)))
        else:
            value_list = re.findall(r'\d+', salary)
            if len(value_list) > 0:
                return int(value_list[-1]) * 1000000
        
        return 0
