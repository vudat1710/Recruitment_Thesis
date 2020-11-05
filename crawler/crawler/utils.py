from extruct.jsonld import JsonLdExtractor
from extruct.w3cmicrodata import MicrodataExtractor
from underthesea import word_tokenize
from .constants import STOPWORDS_PATH
import re, math
import lxml.html as lh
from lxml.html.clean import clean_html
import pandas as pd

jslde = JsonLdExtractor()
mde = MicrodataExtractor()

def merge_data(posts, companies):
    post_df = pd.DataFrame(posts)
    company_df = pd.DataFrame(companies)
    company_df = company_df.rename(columns={"description": "company_description", "address": "company_address"})
    merged_data = pd.merge(post_df, company_df, on="company_url")
    return list(merged_data.T.to_dict().values())

def sort_by_frequency(inverted_index, arr):
    return sorted(arr,
                  key=lambda arr_i: len(inverted_index[arr_i] if arr_i in inverted_index else []), reverse=True)

def get_post_to_check(post):
    return [post["title"], post["name"], post["workplace"]]

def get_prefix_threshold(x, y, sim_threshold):
    k = math.ceil(
        (sim_threshold / (sim_threshold + 1)) * (len(x) + len(y)))
    if len(x) >= k and len(y) >= k:
        return (y, k)
    return None

def preprocess(text):
    tokens = word_tokenize(text, format="text").split(" ")
    return [x.lower() for x in tokens if x not in load_stop_list(STOPWORDS_PATH)]


def lxml_to_text(html):
    doc = lh.fromstring(html)
    doc = clean_html(doc)
    return doc.text_content()


def get_full_url(response, url):
    res = url
    if "http" in url:
        res = url
    else:
        res = response.urljoin(url)

    return res.split(".html")[0] + ".html"


def load_stop_list(file_path):
    result = []
    with open(file_path, "r") as f:
        for line in f.readlines():
            result.append(line.strip())

    return result


def transform_response(json_response):
    result = {}
    try:
        json_response = [x["properties"] for x in json_response]
    except:
        pass
    for element in json_response:
        for key in element.keys():
            if isinstance(element[key], list):
                temp = {}
                val = []
                for item in element[key]:
                    if isinstance(item, dict) and list(item.keys()) == ["type", "properties"]:
                        temp.update(item["properties"])
                    elif isinstance(item, dict) and "@type" in item.keys() and len(item.keys()) == 2:
                        temp.update(
                            item[[x for x in item.keys() if x != "@type"][0]])
                    else:
                        val.append(item)
                if len(temp.keys()) > 0:
                    result.update({key: temp})
                else:
                    result.update({key: val})
            elif isinstance(element[key], dict) and list(element[key].keys()) == ["type", "properties"]:
                result.update({key: element[key]["properties"]})
            elif isinstance(element[key], dict) and "@type" in element[key].keys() and len(element[key].keys()) == 2:
                result.update(
                    {key: element[key][[x for x in element[key].keys() if x != "@type"][0]]})
            else:
                result.update({key: element[key]})
    return result


def flatten_dict(d):
    result = {}
    for k, v in d.items():
        if k.startswith('@') or k == 'identifier' or k == 'type':
            continue
        if type(v) is dict:
            result = {**result, **{f'{k}_{k_}': v_ for k_,
                                   v_ in flatten_dict(v).items()}}
        elif type(v) is list:
            if len(v) == 1 and type(v[0]) is dict:
                result = {**result, **{f'{k}_{k_}': v_ for k_,
                                       v_ in flatten_dict(v[0]).items()}}
            else:
                result[k] = v
        else:
            if is_url(v):
                continue
            result[k] = v
    return result


def is_url(url):
    pattern = r"^http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+$"
    return re.match(pattern, str(url)) is not None


def get_norm_job_name(job_name, major_dict):
    norm_category = []
    for item in job_name.split(','):
        norm_item = major_dict[re.sub("\s*[-/]\s*", " - ", item.strip())]
        if norm_item:
            norm_category.append(norm_item)

    return norm_category


def read_data_file(filepath):
    X, y = [], []
    with open(filepath, "r", encoding="utf8") as f:
        for line in f.readlines():
            if line.strip() != "":
                line = line.strip().split("\t")
                # print(line)
                X.append(line[0])
                y.append(int(line[1]))
    return X, y


def build_inverted_index(docs):
    inverted_index = {}
    for i, doc in enumerate(docs):
        for word in doc:
            doc_list = inverted_index.setdefault(word, [])
            doc_list.append(i)
    return inverted_index

def get_field_data(post, field_name):
    if field_name in post:
        return "'{}'".format(post[field_name])
    else: return "NULL"

def get_sample_data_from_json_type(response):
    try:
        return jslde.extract(response.text)
    except:
        return []


def get_sample_data_from_microdata_type(response):
    return mde.extract(response.body)
