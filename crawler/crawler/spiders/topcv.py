from scrapy import Request, FormRequest
from scrapy.exceptions import CloseSpider
from scrapy.spiders import CrawlSpider
from ..items import TopCVItem, CompanyItem, MajorItem

BASE_URL = "https://www.topcv.vn/"
USERNAME = "vudat1710@gmail.com"
PASSWORD = "17101998"
START_LINKS_PATH = "./crawler/data/topcv/topcv_start_links.txt"
NUM_STOP = 100000

class TopCVCrawler(CrawlSpider):
    name = "topcv"
    allowed_domains = ["www.topcv.vn"]
    start_urls = []
    
    def __init__(self, **kwargs):
        self.count = 0
        self.company_url_list = []
        self.post_urls = []
        CrawlSpider.__init__(self, **kwargs)

    def start_requests(self):
        yield Request(url=BASE_URL+'login/', callback=self.login_parse)

    def login_parse(self, response):
        yield FormRequest.from_response(
            response,
            formxpath='//form[@id="form-login"]',
            formdata={
                'email': USERNAME,
                'password': PASSWORD,
            },
            callback=self.after_login,
            dont_filter=True
            )
    
    def after_login_get_start_links(self, response):
        url = "https://www.topcv.vn/viec-lam"
        yield Request(url=url, callback=self.get_start_links)
    
    def get_start_links(self, response):
        urls = response.xpath('//div[@id="box-find-categories-job"]/div/div/div/div/ul/li/a/@href').extract()
        with open("./crawler/data/topcv/topcv_start_links.txt", "w") as f:
            for url in urls:
                f.write(url + "\n")
        f.close()
        elements = response.xpath('//div[@id="box-find-categories-job"]/div/div/div/div/ul/li')
        for element in elements:
            item = MajorItem()
            item["major_url"] = element.xpath('./a/@href').extract_first()
            item["name"] = element.xpath('./a/span/text()').extract_first().strip()[9:]

            yield item
    
    def after_login(self, response):
        with open(START_LINKS_PATH, "r") as f:
            for line in f.readlines():
                self.start_urls.append(line.strip())
        f.close()

        yield Request(url=self.start_urls[self.count], callback=self.posts_parse)
        # yield Request(url="https://www.topcv.vn/tim-viec-lam-an-toan-lao-dong-c10101", callback=self.posts_parse)
    
    def posts_parse(self, response):
        self.post_urls = list(set(self.post_urls))
        self.post_urls.extend(response.xpath('//h4[@class="job-title"]/a/@href').extract())
        next_page_url = response.xpath('//a[@rel="next"]/@href').extract_first()
        if next_page_url:
            yield Request(url=next_page_url, callback=self.posts_parse)
            if len(self.post_urls) > NUM_STOP:
                self.post_urls = list(set(self.post_urls))
                for post_url in self.post_urls:
                    yield Request(url=post_url, callback=self.get_item)
                return
        else:
            self.count += 1
            if self.count < len(self.start_urls):
                yield Request(url=self.start_urls[self.count], callback=self.posts_parse)
            else:
                self.post_urls = list(set(self.post_urls))
                for post_url in self.post_urls:
                    yield Request(url=post_url, callback=self.get_item)
                return
    
    def get_item(self, response):
        item = TopCVItem()
        company_url = ""
        if "/brand/" in response.url:
            # title_list = response.xpath('//h2[@class="job-name text-premium"]/text()').extract()
            # title_extra = response.xpath('//h2[@class="job-name text-premium"]/a/text()').extract_first()
            # if title_extra:
            #     item["title"] = title_list[0] + title_extra + ' '.join(title_list[1:])
            # else: item["title"] = ' '.join(title_list)
            # item["company_title"] = response.xpath('//div[@id="company-name"]/h1/text()').extract_first().strip()
            # try:
            #     item["address"] = response.xpath('//span[@title="Địa chỉ làm việc"]/text()').extract_first().strip()
            # except:
            #     pass
            # item["valid_through"] = response.xpath('//span[@title="Hạn ứng tuyển"]/text()').extract_first().strip()
            # item["salary"] = response.xpath('//span[@title="Mức lương"]/text()').extract_first().strip()
            # item["job_type"] = response.xpath('//span[@title="Hình thức làm việc"]/text()').extract_first().strip()
            # item["num_hiring"] = response.xpath('//span[@title="Số lượng cần tuyển"]/text()').extract_first().strip()
            # item["position"] = ""
            # item["experience"] = response.xpath('//span[@title="Yêu cầu kinh nghiệm"]/text()').extract_first().strip()
            # item["gender"] = response.xpath('//span[@title="Giới tính"]/text()').extract_first().strip()           
            # item["workplace"] = ""
            # item["img"] = response.xpath('//div[@id="company-logo"]/img/@src').extract_first()
            # content = response.xpath('//div[@class="job-data"]/div')
            # item["description"] = ' '.join([x for x in content[0].xpath('.//text()').extract() if x != "\n" and x != ""])
            # item["extra_requirements"] = ' '.join([x for x in content[1].xpath('.//text()').extract() if x != "\n" and x != ""])
            # item["job_benefits"] = ' '.join([x for x in content[2].xpath('.//text()').extract() if x != "\n" and x != ""])
            # item["majors"] = response.xpath('//div[@class="col-md-8 col-sm-12"]/div[4]/span/a/text()').extract()
            # company_url = response.xpath('//div[@id="nav"]/div/ul/li[2]/a/@href').extract_first()
            # item["company_url"] = company_url
            # item["post_url"] = response.url
            # item["qualification"] = ""

            # yield item
            pass
        else:
            title_list = response.xpath('//h1[@class="job-title text-highlight bold text-uppercase"]/text()').extract()
            title_extra = response.xpath('//h1[@class="job-title text-highlight bold text-uppercase"]/a/text()').extract_first()
            if title_extra:
                item["title"] = title_list[0] + title_extra + ' '.join(title_list[1:])
            else: item["title"] = ' '.join(title_list)
            item["company_title"] = response.xpath('//div[@class="company-title"]/span/a/text()').extract_first()
            item["address"] = [x.strip() for x in response.xpath('//div[@class="text-dark-gray"]/text()').extract() if x != '\n'][0]
            item["valid_through"] = [x.strip() for x in response.xpath('//div[@class=" text-dark-gray  job-deadline"]/text()').extract() if x != '\n'][0]
            recuit_info = [x.strip() for x in response.xpath('//div[@class="job-info-item"]/span/text()').extract() if x.strip() != '']
            item["salary"] = recuit_info[0]
            item["job_type"] = recuit_info[1]
            item["num_hiring"] = recuit_info[2]
            item["position"] = recuit_info[3]
            item["experience"] = recuit_info[4]
            item["gender"] = recuit_info[5]           
            item["workplace"] = ', '.join(response.xpath('//div[@class="job-info-item"]/span/a/text()').extract())
            item["img"] = response.xpath('//img[@class="company-logo"]/@src').extract_first()
            content = response.xpath('//div[@class="content-tab"]')
            item["description"] = ' '.join([x for x in content[0].xpath('.//text()').extract() if x != "\n" and x != ""])
            item["extra_requirements"] = ' '.join([x for x in content[1].xpath('.//text()').extract() if x != "\n" and x != ""])
            item["job_benefits"] = ' '.join([x for x in content[2].xpath('.//text()').extract() if x != "\n" and x != ""])
            item["majors"] = response.xpath('//div[@id="col-job-left"]/div[6]/span/a/text()').extract()
            company_url = response.xpath('//div[@class="company-title"]/span/a/@href').extract_first()
            item["company_url"] = company_url.replace("www.", "")
            item["post_url"] = response.url.replace("www.", "")
            item["qualification"] = ""

            yield item

        if company_url not in self.company_url_list:
            self.company_url_list.append(company_url)
            yield Request(url=company_url, callback=self.get_company)
    
    def get_company(self, response):
        item = CompanyItem()
        if "/brand/" in response.url:
            item["name"] = response.xpath('//div[@id="company-name"]/h1/text()').extract_first()
            item["company_url"] = response.url
            item["description"] = ''.join(response.xpath('//div[@class="intro-content"]//text()').extract()).strip()
            item["address"] = response.xpath('//div[@class="content-contact"]/div[descendant::i[contains(@class, "fa-map-marker")]]/span/text()').extract_first()
            yield item
        else:          
            item["name"] = response.xpath('//h1[@class="company-detail-name text-highlight"]/text()').extract_first()
            item["company_url"] = response.url.replace("www.", "")
            item["description"] = ' '.join(response.xpath('//div[@class="row box-company-info"]/div[1]/div[2]/p/text()').extract())
            item["address"] = ''.join(response.xpath('//div[@id="box-detail-info-company"]/p[descendant::i[contains(@class, "map")]]/text()').extract()).strip()
            yield item