from template import *
import json
import pandas as pd
from math import sqrt
import pprint

def nominal_attr(u, x):
    if u == x:
        return 1
    else: return 0

def experience_attr(u, x):
    if x == 99:
        return 1 - u / 8
    else:
        if u > x:
            return 0.1
        else:
            return (1 - (x - u) / 5)

def gender_attr(u, x):
    if x == "Không yêu cầu":
        return 0.9
    else:
        return nominal_attr(u,x)

def salary_attr(u, x):
    if x == "Thoả thuận":
        return 0.5

    u_index = SALARY.index(u)
    x_index = SALARY.index(x)

    return 1 - (abs(u_index - x_index) / len(SALARY))


def workplace_qualification_attr(u, x):
    u = set([item.strip() for item in u.split(",")])
    x = set([item.strip() for item in x.split(",")])
    
    if len(u.intersection(x)) != 0:
        return 1
    else:
        return 0

def major_attr(u, x):
    u = set([item.strip() for item in u.split(",")])
    x = set([item.strip() for item in x.split(",")])

    return len(u.intersection(x)) / len(u.union(x))

def get_score_user(user, post):
    gender = WEIGHTS["gender"] * gender_attr(user["gender"], post["gender"])
    job_type = WEIGHTS["job_type"] * nominal_attr(user["job_type"], post["job_type"])
    salary = WEIGHTS["salary"] * salary_attr(user["salary"], post["salary_type"])
    qualification = WEIGHTS["qualification"] * workplace_qualification_attr(user["qualification"], post["qualification"])
    workplace = WEIGHTS["workplace"] * workplace_qualification_attr(user["WorkPlaces"], post["WorkPlaces"])
    major = WEIGHTS["major"] * workplace_qualification_attr(user["Majors"], post["Majors"])
    experience = WEIGHTS["experience"] * experience_attr(int(user["experience"]), post["experience"])

    return sqrt(gender ** 2 + job_type ** 2 + salary ** 2 + qualification ** 2 + workplace ** 2 + major ** 2 + experience ** 2)

def update_score_user(user, post):
    pass


def test():
    u = {"gender": "Nam", "experience": 1, "qualification": "Đại học", "job_type": "Bán thời gian", "salary": "15-20 triệu", "workplaces": "Hà Nội, Hồ Chí Minh", "majors": "CNTT - Phần mềm"}
    posts = json.load(open("/home/vudat1710/Downloads/Thesis/Recruitment_Thesis/all_posts.json", "r"))
    posts = [x for x in posts if x is not None]
    df = pd.DataFrame(posts)
    df['WorkPlaces'] = df['WorkPlaces'].apply(lambda l: ", ".join([x['name'] for x in l]))
    df['Majors'] = df['Majors'].apply(lambda l: ", ".join([x['name'] for x in l]))
    df["experience"] = df["experience"].apply(lambda x: int(x))
    # posts = df[df["majors"].str.contains("CNTT")].to_dict('records')
    posts = df.to_dict('records')

    res = []

    for post in posts:
        score = get_score_user(u, post)

        # if (score >= 0.7):
        res.append({"post": post, "score": score})

    pprint.pprint(sorted(res, key=lambda x: x["score"], reverse=True)[:10])

# test()