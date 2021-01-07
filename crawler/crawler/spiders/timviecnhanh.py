from scrapy import Request, FormRequest
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.exceptions import CloseSpider
from ..utils import normalize_long_text, normalize_date
import datetime, json, re
from ..items import TVNItem, TVNCompanyItem, TVNMajorItem

BASE_URL = "https://www.timviecnhanh.com/"
START_LINKS_PATH = "./crawler/data/timviecnhanh/timviecnhanh_start_links.txt"
MAJOR_LINK = "https://www.timviecnhanh.com/vieclam/timkiem?tu_khoa=&nganh_nghe%5B%5D={}&tinh_thanh%5B%5D="
NUM_STOP = 10000
today = datetime.datetime.now()
today = datetime.datetime.strptime(today.strftime("%Y-%m-%d"), "%Y-%m-%d")

class TVNCrawler(CrawlSpider):
    name = "timviecnhanh"
    allowed_domains = ["www.timviecnhanh.com"]
    start_urls = []
    
    def __init__(self, term=None, **kwargs):
        self.count = 0
        self.term = term
        self.company_url_list = []
        self.post_urls = []
        CrawlSpider.__init__(self, **kwargs)

    def start_requests(self):
        # yield Request(url=BASE_URL, callback=self.get_start_links)
        
        with open(START_LINKS_PATH, "r") as f:
            for line in f.readlines():
                self.start_urls.append(line.strip())
        f.close()

        yield Request(url=self.start_urls[self.count], callback=self.posts_parse)
        # yield Request(url="https://www.timviecnhanh.com/vieclam/timkiem?tu_khoa=&nganh_nghe%5B%5D=36&tinh_thanh%5B%5D=", callback=self.posts_parse, dont_filter=True)
    
    def get_start_links(self, response):
        urls = response.xpath('//div[@id="field-hot-content"]/ul/li/a/@href').extract()
        with open("./crawler/data/timviecnhanh/timviecnhanh_start_links.txt", "w") as f:
            for url in urls:
                f.write(MAJOR_LINK.format(url[-7:-5]) + "\n")
        f.close()
        elements = response.xpath('//div[@id="field-hot-content"]/ul/li')
        for element in elements:
            item = TVNMajorItem()
            item["major_url"] = MAJOR_LINK.format(element.xpath('./a/@href').extract_first()[-7:-5])
            item["name"] = element.xpath('./a/@title').extract_first().strip()

            yield item
    
    def posts_parse(self, response):
        self.post_urls = list(set(self.post_urls))
        next_start_url = False
        self.post_urls.extend(response.xpath('//table[@class="table-content"]/tbody/tr/td/a[contains(@data-box, "search_page")]/@href').extract())
        next_page_url = response.xpath('//div[contains(@class, "page-navi")]/a[contains(@class, "next")]/@href').extract_first()
        if next_page_url:   
            if int(next_page_url.split("&page=")[-1]) < 51:
                yield Request(url=next_page_url, callback=self.posts_parse, dont_filter=True)
            else:
                next_start_url = True
            if len(self.post_urls) > NUM_STOP:
                self.post_urls = list(set(self.post_urls))
                for post_url in self.post_urls:
                    yield Request(url=post_url, callback=self.get_item, dont_filter=True)
                return
        if not next_page_url or next_start_url:
            self.count += 1
            if self.count < len(self.start_urls):
                yield Request(url=self.start_urls[self.count], callback=self.posts_parse)
            else:
                self.post_urls = list(set(self.post_urls))
                for post_url in self.post_urls:
                    yield Request(url=post_url, callback=self.get_item, dont_filter=True)
                return

    def get_item(self, response):
        item = TVNItem()

        if self.term == "daily":
            string = response.xpath('//script[@type="application/ld+json"]/text()').extract_first()
            datePosted = json.loads(string.replace("\n", "").replace("\t", ""))["datePosted"]
            datePosted = re.search(r"\d{4}[-/]\d{2}[-/]\d{2}", datePosted).group(0)
            if today <= datetime.datetime.strptime(datePosted, "%Y-%m-%d"):
                item["valid_through"] = response.xpath('//td/b[@class="text-danger"]/text()').extract_first().strip()
                item["title"] = response.xpath('//header[@class="block-title"]/h1/span/text()').extract_first().strip()
                item["company_title"] = response.xpath('//article[@class="block-content"]/div[2]/h3/a/text()').extract_first()
                item["address"] = response.xpath('//article[@class="block-content"]/div[2]/span/text()').extract_first().strip()[9:]
                item["salary"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[1]/ul/li[1]/text()').extract() if x.strip() != ""]).strip()
                item["job_type"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[2]/ul/li[4]/text()').extract() if x.strip() != ""]).strip()
                item["num_hiring"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[2]/ul/li[1]/text()').extract() if x.strip() != ""]).strip()
                item["position"] = response.xpath('//header[@class="block-title"]/h1/span/text()').extract_first().strip()
                item["experience"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[1]/ul/li[2]/text()').extract() if x.strip() != ""]).strip()
                item["gender"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[2]/ul/li[2]/text()').extract() if x.strip() != ""]).strip()          
                item["workplace"] = ', '.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[1]/ul/li[4]/a/text()').extract() if x.strip() != ""]).strip()
                item["img"] = response.xpath('//div[@class="block-sidebar"]/div/div/div/img/@src').extract_first()
                item["description"] = '\n'.join(normalize_long_text(response.xpath('//article[@class="block-content"]/table/tbody/tr[1]/td[2]/p//text()').extract())).strip()
                item["job_benefits"] = '\n'.join(normalize_long_text(response.xpath('//article[@class="block-content"]/table/tbody/tr[3]/td[2]/p//text()').extract())).strip()
                item["extra_requirements"] = '\n'.join(normalize_long_text(response.xpath('//article[@class="block-content"]/table/tbody/tr[2]/td[2]/p//text()').extract())).strip()
                item["majors"] = response.xpath('//article[@class="block-content"]/div[5]/div[1]/ul/li[5]/a/text()').extract()
                item["qualification"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[1]/ul/li[3]/text()').extract() if x.strip() != ""]).strip()
                company_url = response.xpath('//article[@class="block-content"]/div[2]/h3/a/@href').extract_first()
                item["company_url"] = company_url.replace("www.", "")
                item["post_url"] = response.url.replace("www.", "")
                item["contact_name"] = response.xpath('//div[@class="block-info-company"]/div/table/tr[1]/td[2]/p/text()').extract_first().strip()

                yield item

                if company_url not in self.company_url_list:
                    self.company_url_list.append(company_url)
                    yield Request(url=company_url, callback=self.get_company, dont_filter=True)
        else:
            item["valid_through"] = response.xpath('//td/b[@class="text-danger"]/text()').extract_first().strip()
            item["title"] = response.xpath('//header[@class="block-title"]/h1/span/text()').extract_first().strip()
            item["company_title"] = response.xpath('//article[@class="block-content"]/div[2]/h3/a/text()').extract_first()
            item["address"] = response.xpath('//article[@class="block-content"]/div[2]/span/text()').extract_first().strip()[9:]
            item["salary"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[1]/ul/li[1]/text()').extract() if x.strip() != ""]).strip()
            item["job_type"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[2]/ul/li[4]/text()').extract() if x.strip() != ""]).strip()
            item["num_hiring"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[2]/ul/li[1]/text()').extract() if x.strip() != ""]).strip()
            item["position"] = response.xpath('//header[@class="block-title"]/h1/span/text()').extract_first().strip()
            item["experience"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[1]/ul/li[2]/text()').extract() if x.strip() != ""]).strip()
            item["gender"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[2]/ul/li[2]/text()').extract() if x.strip() != ""]).strip()          
            item["workplace"] = ', '.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[1]/ul/li[4]/a/text()').extract() if x.strip() != ""]).strip()
            item["img"] = response.xpath('//div[@class="block-sidebar"]/div/div/div/img/@src').extract_first()
            item["description"] = '\n'.join(normalize_long_text(response.xpath('//article[@class="block-content"]/table/tbody/tr[1]/td[2]/p//text()').extract())).strip()
            item["job_benefits"] = '\n'.join(normalize_long_text(response.xpath('//article[@class="block-content"]/table/tbody/tr[3]/td[2]/p//text()').extract())).strip()
            item["extra_requirements"] = '\n'.join(normalize_long_text(response.xpath('//article[@class="block-content"]/table/tbody/tr[2]/td[2]/p//text()').extract())).strip()
            item["majors"] = response.xpath('//article[@class="block-content"]/div[5]/div[1]/ul/li[5]/a/text()').extract()
            item["qualification"] = ''.join([x for x in response.xpath('//article[@class="block-content"]/div[5]/div[1]/ul/li[3]/text()').extract() if x.strip() != ""]).strip()
            company_url = response.xpath('//article[@class="block-content"]/div[2]/h3/a/@href').extract_first()
            item["company_url"] = company_url.replace("www.", "")
            item["post_url"] = response.url.replace("www.", "")
            item["contact_name"] = response.xpath('//div[@class="block-info-company"]/div/table/tr[1]/td[2]/p/text()').extract_first().strip()

            yield item

            if company_url not in self.company_url_list:
                self.company_url_list.append(company_url)
                yield Request(url=company_url, callback=self.get_company, dont_filter=True)
        
    
    def get_company(self, response):
        item = TVNCompanyItem()
        item["name"] = response.xpath('//header[@class="block-title"]/h1/span/text()').extract_first().strip()
        item["company_url"] = response.url.replace("www.", "")
        item["description"] = '\n'.join(normalize_long_text(response.xpath('//span[@id="description_detail_full"]//text()').extract())).strip()
        item["address"] = response.xpath('//div[@class="block-sidebar"]/div/div/p[1]/text()').extract_first().strip()

        yield item