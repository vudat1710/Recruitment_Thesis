from .template import *

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


u = {"gender": "Nam", "experience": 2, "qualification": "Đại học", "job_type": "Toàn thời gian", "salary": "15-20 triệu", "workplaces": "Hà Nội, Hồ Chí Minh", "majors": "CNTT - Phần mềm"}