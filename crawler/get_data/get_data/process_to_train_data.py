from html2text import HTML2Text
import json, os, re
from utils import flatten_dict, lxml_to_text
from constants import MEDIATED_SCHEMA_PATH, SAMPLE_PATH, DATA_PATH

class GetTrainData:
    def __init__(self):
        self.html2text = HTML2Text()
        self.mediated_schema = json.load(open(MEDIATED_SCHEMA_PATH, "r"))
        self._attr_keys = flatten_dict(self.mediated_schema).keys()
        # print(self._attr_keys)

    def parse(self):
        count = 0
        for filename in os.listdir(SAMPLE_PATH):
            print(filename)
            filepath = SAMPLE_PATH + filename
            data = json.load(open(filepath, "r"))
            self.convert(data)
            count += 1
            if count == 3:
                break


    def convert(self, data):
        files = {}
        for attr in self._attr_keys:
            files[attr] = open(DATA_PATH + "{}.txt".format(attr), mode='a+', encoding='utf8')

        for post in data:
            if "industry" in post.keys():
                post["occupationalCategory"] = post["industry"]
                post.pop("industry")
            post_keys = post.keys()
            for key in post_keys:
                temp = ""
                if "address_properties" in key:
                    temp = key.replace("_address_properties_", "_")
                else:
                    temp = key
                if temp in self._attr_keys:
                    for curr in self._attr_keys:
                        val = self.get_value_to_write(post[key])
                        if val:
                            val = re.sub("[\r\n]", "", val)
                            val = re.sub("\t", "", val)
                            if temp == curr:
                                files[curr].write(val + '\t1' + '\n')
                            else:
                                files[curr].write(val + '\t0' + '\n')

    def get_value_to_write(self, data):
        if isinstance(data, list):
            data = "\n".join(list(set(data)))
        else:
            data = str(data)
        
        try:
            return lxml_to_text(data)
        except:
            return None

if __name__=="__main__":
    a = GetTrainData()
    a.parse()