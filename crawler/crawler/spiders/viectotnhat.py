from scrapy import Request, FormRequest
from scrapy.spiders import CrawlSpider, Rule
from scrapy.exceptions import CloseSpider
from scrapy.linkextractors import LinkExtractor
from ..items import VTNItem, VTNCompanyItem, VTNMajorItem
from ..utils import normalize_long_text, normalize_date
import datetime, json

BASE_URL = "https://www.viectotnhat.com"
START_LINKS_PATH = "./crawler/data/viectotnhat/viectotnhat_start_links.txt"
MAJOR_LINK = "https://viectotnhat.com/viec-lam/tim-kiem?tu_khoa=&nganh_nghe={}&tinh_thanh=0"
NUM_STOP = 10000
today = datetime.datetime.now()
today = datetime.datetime.strptime(today.strftime("%Y-%m-%d"), "%Y-%m-%d")

class VTNCrawler(CrawlSpider):
    name = "viectotnhat"
    allowed_domains = ["www.viectotnhat.com"]
    start_urls = []
    
    def __init__(self, term=None, **kwargs):
        self.count = 0
        self.term = term
        self.company_url_list = []
        self.post_urls = []
        CrawlSpider.__init__(self, **kwargs)

    def start_requests(self):
        # yield Request(url="https://viectotnhat.com/viec-lam/tim-kiem-nang-cao", callback=self.get_start_links)
        
        with open(START_LINKS_PATH, "r") as f:
            for line in f.readlines():
                self.start_urls.append(line.strip())
        f.close()

        yield Request(url=self.start_urls[self.count], callback=self.posts_parse)
        # yield Request(url="https://viectotnhat.com/viec-lam/tim-kiem?tu_khoa=&nganh_nghe=27&tinh_thanh=0", callback=self.posts_parse, dont_filter=True)
    
    def get_start_links(self, response):
        urls = response.xpath('//div[@id="vl-nganh-nghe"]/div/ul/li/a/@href').extract()
        with open("./crawler/data/viectotnhat/viectotnhat_start_links.txt", "w") as f:
            for url in urls:
                f.write(MAJOR_LINK.format(url[-7:-5]) + "\n")
        f.close()
        elements = response.xpath('//div[@id="vl-nganh-nghe"]/div/ul/li')
        for element in elements:
            item = VTNMajorItem()
            item["major_url"] = MAJOR_LINK.format(element.xpath('./a/@href').extract_first()[-7:-5])
            item["name"] = element.xpath('./a/text()').extract_first().strip()

            yield item
    
    def posts_parse(self, response):
        self.post_urls = list(set(self.post_urls))
        next_start_url = False
        self.post_urls.extend(response.xpath('//h3[contains(@class, "job-name")]/a/@href').extract())
        next_page_url = response.xpath('//ul[@class="pagination"]/li[last()]/a/@href').extract_first()
        if next_page_url:
            try: 
                if int(next_page_url.split("&page=")[-1]) < 51:
                    yield Request(url=BASE_URL+next_page_url, callback=self.posts_parse, dont_filter=True)
                else:
                    next_start_url = True
            except:
                next_start_url = True
            if len(self.post_urls) > NUM_STOP:
                self.post_urls = list(set(self.post_urls))
                for post_url in self.post_urls:
                    yield Request(url=post_url, callback=self.get_item, dont_filter=True)
                return
        if not next_page_url or next_start_url:
            self.count += 1
            if self.count < len(self.start_urls):
                yield Request(url=self.start_urls[self.count], callback=self.posts_parse, dont_filter=True)
            else:
                self.post_urls = list(set(self.post_urls))
                for post_url in self.post_urls:
                    yield Request(url=post_url, callback=self.get_item, dont_filter=True)
                return
    
    def get_item(self, response):
        item = VTNItem()
        if self.term == "daily":
            string = response.xpath('//script[@type="application/ld+json"]/text()').extract_first()
            datePosted = json.loads(string.replace("\n", "").replace("\t", "")[:-1])["datePosted"]
            if today <= datetime.datetime.strptime(datePosted, "%Y-%m-%d"):
                self.item_crawl(item, response)
        else:
            self.item_crawl(item, response)
        
    def item_crawl(self, item, response):
        item["valid_through"] = response.xpath('//span[contains(@class,"color-orange2")]/text()').extract_first().strip()
        item["title"] = response.xpath('//h1[contains(@class, "title-job")]/text()').extract_first().strip()
        item["company_title"] = response.xpath('//div[contains(@class, "chi-tiet-vl")]/div[4]/div[1]/a/h2/text()').extract_first().strip()
        item["address"] = ''.join([x for x in response.xpath('//div[contains(@class, "job-ads")]/div[2]/text()').extract() if x.strip() != ""]).strip()
        item["salary"] = ''.join([x for x in response.xpath('//div[contains(@class, "list-thong-tin")]/div[1]/div/ul/li[descendant::span[contains(@class, "icon-muc-luong2")]]/text()').extract() if x.strip() != ""]).strip()
        item["job_type"] = ''.join([x for x in response.xpath('//div[contains(@class, "list-thong-tin")]/div[1]/div/ul/li[descendant::span[contains(@class, "icon-hinh-thuc2")]]/text()').extract() if x.strip() != ""]).strip()
        item["num_hiring"] = ''.join([x for x in response.xpath('//div[contains(@class, "list-thong-tin")]/div[1]/div/ul/li[descendant::span[contains(@class, "icon-cap-bac2")]]/span/text()').extract() if x.strip() != ""]).strip()
        item["position"] = ''.join([x for x in response.xpath('//div[contains(@class, "list-thong-tin")]/div[1]/div/ul/li[descendant::span[contains(@class, "icon-cap-bac3")]]/text()').extract() if x.strip() != ""]).strip()
        item["experience"] = ''.join([x for x in response.xpath('//div[contains(@class, "list-thong-tin")]/div[1]/div/ul/li[descendant::span[contains(@class, "icon-kinh-nghiem2")]]/text()').extract() if x.strip() != ""]).strip()
        item["gender"] = ''.join([x for x in response.xpath('//div[contains(@class, "list-thong-tin")]/div[1]/div/ul/li[descendant::span[contains(@class, "icon-gioi-tinh2")]]/text()').extract() if x.strip() != ""]).strip()
        item["workplace"] = ''.join([x for x in response.xpath('//div[contains(@class, "list-thong-tin")]/div[1]/div/ul/li[descendant::span[contains(@class, "icon-dia-diem")]]//text()').extract() if x.strip() != ""]).strip()[19:]
        item["img"] = response.xpath('//div[contains(@class, "img-ads")]/img/@src').extract_first().strip()
        item["description"] = '\n'.join(normalize_long_text(response.xpath('//div[contains(@class, "mo-ta-cv")]//text()').extract())).strip()
        item["job_benefits"] = '\n'.join(normalize_long_text(response.xpath('//div[contains(@class, "quyen-loi")]//text()').extract())).strip()
        item["extra_requirements"] = '\n'.join(normalize_long_text(response.xpath('//div[contains(@class, "yeu-cau")]//text()').extract())).strip()
        majors = response.xpath('//div[contains(@class, "list-thong-tin")]/div[1]/div/ul/li[descendant::span[contains(@class, "icon-nganh-nghe")]]/a/text()').extract()
        # item["majors"] = [MAJOR_LINK.format(m[-7:-5]) for m in majors]
        item["majors"] = majors
        item["qualification"] = ''.join([x for x in response.xpath('//div[contains(@class, "list-thong-tin")]/div[1]/div/ul/li[descendant::span[contains(@class, "icon-trinh-do2")]]/text()').extract() if x.strip() != ""]).strip()
        company_url = response.xpath('//div[contains(@class, "chi-tiet-vl")]/div[4]/div[1]/a/@href').extract_first().strip()
        item["company_url"] = company_url.replace("www.", "")
        item["post_url"] = response.url.replace("www.", "")
        item["contact_name"] = response.xpath('//div[contains(@class, "ho-so")]/ul/li[1]/text()').extract_first().strip()

        yield item

        if company_url not in self.company_url_list:
            self.company_url_list.append(company_url)
            yield Request(url=company_url, callback=self.get_company, dont_filter=True)
    
    def get_company(self, response):
        item = VTNCompanyItem()
        item["name"] = response.xpath('//h2[@class="company-name"]/text()').extract_first().strip()
        item["company_url"] = response.url.replace("www.", "")
        item["description"] = '\n'.join(normalize_long_text(response.xpath('//span[@id="company_info"]//text()').extract())).strip()
        item["address"] = response.xpath('//td[@class="detail-info-company"]/span/text()').extract_first().strip()

        yield item