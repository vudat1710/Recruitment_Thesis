import json
import pandas as pd

def auto_update_profile(user, posts, num_appears, k):
    res = {}

    post_dict = {"majors": [], "workplaces": [], "job_type": [], "salary": []}
    _d = {"majors": {}, "workplaces": {}, "job_type": {}, "salary": {}}

    for post in posts:
        post_dict["majors"].extend(post["Majors"])
        post_dict["workplaces"].extend(post["WorkPlaces"])
        post_dict["job_type"].append((post["job_type"]))
        post_dict["salary"].append(post["salary_type"])

    
    _d["majors"] = dict((x,post_dict["majors"].count(x)) for x in set(post_dict["majors"]))
    _d["workplaces"] = dict((x,post_dict["workplaces"].count(x)) for x in set(post_dict["workplaces"]))
    _d["job_type"] = dict((x,post_dict["job_type"].count(x)) for x in set(post_dict["job_type"]))
    _d["salary"] = dict((x,post_dict["salary"].count(x)) for x in set(post_dict["salary"]))

    for key in _d:
        _d[key] = {a: b for (a, b) in _d[key].items() if b > num_appears and b / len(post_dict[key]) > k }
        if key not in ["majors", "workplaces"]:
            if _d[key] != {}:
                _d[key] = max(_d[key], key=_d[key].get)
                if user[key] != _d[key]:
                    res[key] = _d[key]
        else:
            _d[key] = set(_d[key].keys())  
            if isinstance(user[key], str):  
                temp = [x.strip() for x in user[key].split(", ")]
            else:
                temp = user[key]
            new = set(temp).union(_d[key])
            if len(new.intersection(_d[key])) != 0:
                res[key] = ", ".join(list(new))
    
    return res

def test():
    u = {"gender": "Nam", "experience": 1, "qualification": "Đại học", "job_type": "Bán thời gian", "salary": "15-20 triệu", "workplaces": "Hà Nội, Hồ Chí Minh", "majors": "CNTT - Phần mềm"}
    posts = json.load(open("/home/vudat1710/Downloads/Thesis/Recruitment_Thesis/all_posts.json", "r"))
    posts = [x for x in posts if x is not None]
    df = pd.DataFrame(posts[:30])
    df['WorkPlaces'] = df['WorkPlaces'].apply(lambda l: [x['name'] for x in l])
    df['Majors'] = df['Majors'].apply(lambda l: [x['name'] for x in l])
    df["experience"] = df["experience"].apply(lambda x: int(x))
    # posts = df[df["majors"].str.contains("CNTT")].to_dict('records')
    posts = df.to_dict('records')
    res = auto_update_profile(u, posts, 20, 0.1)
    print(res)

