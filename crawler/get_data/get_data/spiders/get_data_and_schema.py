from scrapy import Request
from scrapy.spiders import CrawlSpider
from ..constants import CRAWL_SITES, MEDIATED_SCHEMA_PATH
from ..utils import *
import json
from collections import ChainMap

class DataCrawler(CrawlSpider):
    name = "get_data"
    allowed_domains = []
    start_urls = []
    
    def __init__(self, **kwargs):
        # self.domain = kwargs['domain']
        self.domain = "jobsgo"
        self.job_url_xpath = CRAWL_SITES[self.domain]["job_url"]
        self.next_page_xpath = CRAWL_SITES[self.domain]["next_page_url"]
        self.response_format = ""
        self.post_urls = []
        self.samples = []
        self.count = 0
        self.NUM_STOP = 1000
        self.mediated_schema = json.load(open(MEDIATED_SCHEMA_PATH, "r"))

        CrawlSpider.__init__(self, **kwargs)

    def start_requests(self):
        yield Request(url=CRAWL_SITES[self.domain]["url"], callback=self.get_sample_post_url)

    def get_sample_post_url(self, response):
        post_url = response.xpath(self.job_url_xpath + "/@href").extract_first()
        # print(post_url)
        yield Request(url=get_full_url(response, post_url), callback=self.check_response_format)
    
    def check_response_format(self, response):
        could_crawl = True
        if len(get_sample_data_from_json_type(response)) > 0:
            self.response_format = "json-ld"
        elif len(get_sample_data_from_microdata_type(response)) > 0:
            self.response_format = "microdata"
        else:
            could_crawl = False
        
        if could_crawl:
            yield Request(url=CRAWL_SITES[self.domain]["url"], callback=self.get_all_post_urls, dont_filter=True)
    
    def get_all_post_urls(self, response):
        self.post_urls.extend(response.xpath(self.job_url_xpath + "/@href").extract())
        next_page_url = response.xpath(self.next_page_xpath + "/@href").extract_first()

        if next_page_url and len(self.post_urls) <= self.NUM_STOP:
            yield Request(url=get_full_url(response, next_page_url), callback=self.get_all_post_urls, dont_filter=True)
        else:
            yield Request(url=get_full_url(response, self.post_urls[0]), callback=self.get_sample_schema, dont_filter=True)

            for post_url in self.post_urls:
                yield Request(url=get_full_url(response, post_url), callback=self.get_samples, dont_filter=True)
    
    def get_samples(self, response):
        data = []
        if self.response_format == "json-ld":
            data = get_sample_data_from_json_type(response)
            # data = dict(ChainMap(*data))
        elif self.response_format == "microdata":
            data = get_sample_data_from_microdata_type(response)
        
        data = transform_response(data)
        # data = transform_response([data])
        data = flatten_dict(data)
        self.samples.append(data)
        self.count += 1
        if self.count == len(self.post_urls):
            json.dump(self.samples, open("get_data/sample/{}.json".format(self.domain), "w"))


    def get_sample_schema(self, response):
        if self.response_format == "json-ld":
            json.dump(get_sample_data_from_json_type(response), open("get_data/sample_schema/{}_schema.json".format(self.domain), "w"), ensure_ascii=False)
        elif self.response_format == "microdata":
            json.dump(get_sample_data_from_microdata_type(response), open("get_data/sample_schema/{}_schema.json".format(self.domain), "w"), ensure_ascii=False)
