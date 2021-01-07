from scrapy import Request, FormRequest
from scrapy.exceptions import CloseSpider
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from ..items import MyWorkItem, MyWorkCompanyItem, MyWorkMajorItem
import json, datetime
from ..utils import normalize_date

BASE_URL = "https://www.mywork.com.vn"
START_LINKS_PATH = "./crawler/data/mywork/mywork_start_links.txt"
START_LINK_PREFIX = "https://mywork.com.vn/tuyen-dung?categories="
NUM_STOP = 10000
today = datetime.datetime.now()
today = datetime.datetime.strptime(today.strftime("%Y-%m-%d"), "%Y-%m-%d")

class MyWorkCrawler(CrawlSpider):
    name = "mywork"
    allowed_domains = ["www.mywork.com.vn"]
    start_urls = []
    major_list = {}
    
    def __init__(self, term=None, **kwargs):
        self.count = 0
        self.term = term
        self.company_url_list = []
        self.post_urls = []
        CrawlSpider.__init__(self, **kwargs)

    def start_requests(self):
        # yield Request(url=BASE_URL, callback=self.get_start_links)

        temp = json.load(open('./crawler/data/mywork/major.json', 'r'))
        for item in temp:
            self.major_list[item["name"]] = item["major_url"]

        with open(START_LINKS_PATH, "r") as f:
            for line in f.readlines():
                self.start_urls.append(line.strip())
        f.close()
        self.start_urls = list(set(self.start_urls))

        yield Request(url=self.start_urls[self.count], callback=self.posts_parse)

        # yield Request(url="https://mywork.com.vn/tuyen-dung?categories=59", callback=self.posts_parse)
    
    def get_start_links(self, response):
        urls = response.xpath('//*[@id="__layout"]/section/div[3]/section/div/div[7]/div/div/div/div/div[1]/div/a/@href').extract()
        with open("./crawler/data/mywork/mywork_start_links.txt", "w") as f:
            for url in urls:
                f.write(START_LINK_PREFIX+url.split("/")[-2] + "\n")
        f.close()
        elements = response.xpath('//*[@id="__layout"]/section/div[3]/section/div/div[7]/div/div/div/div/div[1]/div')
        for element in elements:
            item = MyWorkMajorItem()
            item["major_url"] = START_LINK_PREFIX + element.xpath('./a/@href').extract_first().split("/")[-2]
            item["name"] = element.xpath('./a/text()').extract_first().strip()[9:]

            yield item
    
    def posts_parse(self, response):
        self.post_urls = list(set(self.post_urls))
        next_start_url = False
        self.post_urls.extend(response.xpath('//p[contains(@class, "j_title")]/a/@href').extract())
        next_page_url = response.xpath('//ul[@class="pagination"]/li[last()]/a/@href').extract_first()
        if next_page_url:
            if int(next_page_url.split("?cat")[0].split('/trang/')[1]) < 51:
                yield Request(url=BASE_URL+next_page_url, callback=self.posts_parse, dont_filter=True)
            else:
                next_start_url = True
            if len(self.post_urls) > NUM_STOP:
                self.post_urls = list(set(self.post_urls))
                for post_url in self.post_urls:
                    url_to_crawl = (BASE_URL+post_url).split(".html")[0] + ".html"
                    yield Request(url=url_to_crawl, callback=self.get_item, dont_filter=True)
                return
        if not next_page_url or next_start_url:
            self.count += 1
            if self.count < len(self.start_urls):
                yield Request(url=self.start_urls[self.count], callback=self.posts_parse, dont_filter=True)
            else:
                self.post_urls = list(set(self.post_urls))
                for post_url in self.post_urls:
                    url_to_crawl = (BASE_URL+post_url).split(".html")[0] + ".html"
                    yield Request(url=url_to_crawl, callback=self.get_item, dont_filter=True)
                return

    def get_item(self, response):
        item = MyWorkItem()
        if self.term == "daily":
            string = response.xpath('//script[@type="application/ld+json"]/text()').extract_first()
            datePosted = json.loads(string)["datePosted"]
            if today <= datetime.datetime.strptime(datePosted, "%d/%m/%Y"):
                self.item_crawl(item, response)
        else:
            self.item_crawl(item, response)
    
    def item_crawl(self, item, response):
        item["valid_through"] = response.xpath('//div[@class="box_main_info_job_left"]/div/div/div[descendant::i[contains(@class, "li-clock")]]/span/span[2]/text()').extract_first().strip()
        item["title"] = ' '.join([x for x in response.xpath('//h1[@class="main-title"]/span/text()').extract() if x not in ['hot', '\xa0']])
        item["company_title"] = response.xpath('//h4[contains(@class, "desc-for-title")]/span/text()').extract_first().strip()
        item["address"] = response.xpath('//*[@id="footer"]/div/div/div[3]/div[2]/span/text()').extract_first().strip()
        item["salary"] = response.xpath('//div[@class="box_main_info_job_left"]/div/div/div[descendant::i[contains(@class, "li-cash-dollar")]]/span/text()').extract_first().strip()
        item["job_type"] = response.xpath('//div[@class="box_main_info_job_left"]/div/div/div[descendant::i[contains(@class, "li-store")]]/span/text()').extract_first().strip()
        item["num_hiring"] = response.xpath('//div[@class="box_main_info_job_left"]/div/div/div[descendant::i[contains(@class, "li-users")]]/span/text()').extract_first().strip()
        item["position"] = response.xpath('//div[@class="box_main_info_job_left"]/div/div/div[descendant::i[contains(@class, "li-clipboard-user")]]/span/text()').extract_first().strip()
        item["experience"] = response.xpath('//div[@class="box_main_info_job_left"]/div/div/div[descendant::i[contains(@class, "li-briefcase")]]/span/text()').extract_first().strip()
        item["gender"] = response.xpath('//div[@class="box_main_info_job_left"]/div/div/div[descendant::i[contains(@class, "li-man-woman")]]/span/text()').extract_first().strip()     
        item["workplace"] = response.xpath('//div[@class="box_main_info_job_left"]/div/div/div[descendant::i[contains(@class, "li-map-marker")]]/span/div/text()').extract_first().strip()
        item["img"] = ""
        content = response.xpath('//div[@class="mw-box-item"]')
        item["description"] = '\n'.join([x.replace("\n", " ") for x in content[0].xpath('.//text()').extract() if x != "\n" and x != ""])
        item["job_benefits"] = '\n'.join([x.replace("\n", " ") for x in content[1].xpath('.//text()').extract() if x != "\n" and x != ""])
        item["extra_requirements"] = '\n'.join([x.replace("\n", " ") for x in content[2].xpath('.//text()').extract() if x != "\n" and x != ""])
        item["majors"] = [x.strip() for x in response.xpath('//div[@class="box_main_info_job_left"]/div/div/div[descendant::i[contains(@class, "li-hammer-wrench")]]/span//div/text()').extract_first().strip().split(',')]
        item["qualification"] = response.xpath('//div[@class="box_main_info_job_left"]/div/div/div[descendant::i[contains(@class, "li-library2")]]/span/text()').extract_first().strip()
        company_url = BASE_URL + response.xpath('//*[@id="box_info_job_detail"]/div/div[1]/a/@href').extract_first()
        item["company_url"] = company_url.replace("www.", "")
        item["post_url"] = response.url.replace("www.", "")
        item["contact_name"] = response.xpath('//*[@id="footer"]/div/div/div[2]/div[2]/span/text()').extract_first().strip()

        yield item
        if company_url not in self.company_url_list:
            self.company_url_list.append(company_url)
            yield Request(url=company_url, callback=self.get_company, dont_filter=True)

    def get_company(self, response):
        item = MyWorkCompanyItem()
        item["name"] = response.xpath('//div[contains(@class, j_company)]/div/h1/text()').extract_first()
        item["company_url"] = response.url.replace("www.", "")
        item["description"] = response.xpath('//read-more/@text').extract_first().strip()
        item["address"] = response.xpath('//div[contains(@class, j_company)]/div/div/span/text()').extract_first().strip()

        yield item