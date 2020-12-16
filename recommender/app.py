from flask import Flask, request, Response, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from user_item import get_score_user
from item_item import get_score_item
from profile_update import auto_update_profile
import json

APP_BIND_ADDRESS = '0.0.0.0'
APP_BIND_PORT = 8000

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
posts = json.load(open("/home/vudat1710/Downloads/Thesis/Recruitment_Thesis/all_posts.json", "r"))
posts = [x for x in posts if x is not None]
df = pd.DataFrame(posts)
df['WorkPlaces'] = df['WorkPlaces'].apply(lambda l: ", ".join([x['name'] for x in l]))
df['Majors'] = df['Majors'].apply(lambda l: ", ".join([x['name'] for x in l]))
df["experience"] = df["experience"].apply(lambda x: int(x))
df = df.fillna("Không xác định")
posts = df.to_dict('records')

@app.route("/api2/recommender/getUserRecommend", methods=['GET','POST'])
def get_result_user():
    user_dict = json.load(open("user_item.json", "r"))
    item_dict = json.load(open("item_item.json", "r"))
    user = json.loads(request.data.decode("utf-8"))
    user["Majors"] = ", ".join([x["name"] for x in user["Majors"]])
    user["WorkPlaces"] = ", ".join([x["name"] for x in user["WorkPlaces"]])
    updated_posts = [x["postId"] for x in user["RatePosts"] if x["rate"] > 3]
    updated_posts.extend(user["wishlist"])

    if (str(user["userId"]) in user_dict):
        if (user_dict[str(user["userId"])]["like"] == updated_posts):
            return_posts = [{"post": x} for x in df[df["postId"].isin(user_dict[str(user["userId"])]["candidates"])].to_dict('records')]
            return json.dumps({"data": return_posts})

    res = []
    for post in posts:
        score = get_score_user(user, post)
        res.append({"post": post, "score": score})
    
    res = sorted(res, key=lambda x: x["score"], reverse=True)[:15]
    
    return_data = {
        "data": res,
    }

    if str(user["userId"]) in user_dict:
        user_dict[str(user["userId"])]["candidates"] = [x["post"]["postId"] for x in res]
        user_dict[str(user["userId"])]["like"] = updated_posts
    else:
        user_dict.update({user["userId"]: {"candidates": [x["post"]["postId"] for x in res], "like": updated_posts}})

    json.dump(user_dict, open("user_item.json", "w"))
    json.dump(item_dict, open("item_item.json", "w"))

    return json.dumps(return_data)


@app.route("/api2/recommender/getRelatedItems", methods=['GET','POST'])
def get_result_item():
    item_dict = json.load(open("item_item.json", "r"))
    source = json.loads(request.data.decode("utf-8"))

    if (str(source["postId"]) in item_dict):
        return_posts = [{"post": x} for x in df[df["postId"].isin(item_dict[str(source["postId"])])].to_dict('records')]
        return json.dumps({"data": return_posts})
    else:
        source["Majors"] = ", ".join([x["name"] for x in source["Majors"]])
        source["WorkPlaces"] = ", ".join([x["name"] for x in source["WorkPlaces"]])
        res = []
        for post in posts:
            score = get_score_item(source, post)
            res.append({"post": post, "score": score})
        
        res = sorted(res, key=lambda x: x["score"], reverse=True)[1:11]

        return_data = {
            "data": res,
        }

        item_dict.update({source["postId"]: [x["post"]["postId"] for x in res]})
        json.dump(item_dict, open("item_item.json", "w"))

        return json.dumps(return_data)

@app.route("/api2/recommender/autoUpdateProfile", methods=['GET','POST'])
def updateProfile():
    data = json.loads(request.data.decode("utf-8"))
    user = data["user"]
    posts = []
    user["Majors"] = [x["name"] for x in user["Majors"]]
    user["WorkPlaces"] = [x["name"] for x in user["WorkPlaces"]]
    for post in data["posts"]:
        post["Majors"] = [x["name"] for x in post["Majors"]]
        post["WorkPlaces"] = [x["name"] for x in post["WorkPlaces"]]
        posts.append(post)

    res = auto_update_profile(user, posts, 30, 0.1)
    
    return_data = {
        "data": res,
    }

    return json.dumps(return_data)

if __name__ == "__main__":
    app.run(host=APP_BIND_ADDRESS, port=APP_BIND_PORT, debug=True)