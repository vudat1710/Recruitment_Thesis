from .normalize import PostNormalization
import json, os
from .utils import merge_data

p = PostNormalization()

for folder_name in os.listdir("crawler/data/"):
    posts = json.load(open("crawler/data/{}/post.json".format(folder_name), "r"))
    companies = json.load(open('./crawler/data/{}/company.json'.format(folder_name), 'r'))
    merged_data = merge_data(posts, companies)
    posts = [p.normalize_post(x) for x in merged_data]
    json.dump(posts, open("./crawler/data/{}/norm_post.json".format(folder_name), "w"))