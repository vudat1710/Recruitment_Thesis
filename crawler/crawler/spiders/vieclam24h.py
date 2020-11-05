from scrapy import Request, FormRequest
from scrapy.spiders import CrawlSpider, Rule
from scrapy.linkextractors import LinkExtractor
from scrapy.exceptions import CloseSpider
from ..items import ViecLam24hItem, VL24hCompanyItem, VL24hMajorItem

BASE_URL = "https://vieclam24h.vn"
START_LINKS_PATH = "./crawler/data/vieclam24h/vieclam24h_start_links.txt"
NUM_STOP = 100

class ViecLam24hCrawler(CrawlSpider):
    name = "vieclam24h"
    allowed_domains = ["www.vieclam24h.vn"]
    start_urls = []
    
    def __init__(self, **kwargs):
        self.count = 0
        self.company_url_list = []
        self.post_urls = []
        CrawlSpider.__init__(self, **kwargs)

    def start_requests(self):
        # yield Request(url="https://vieclam24h.vn/tim-kiem-viec-lam-nang-cao?gate=&from=homepage", callback=self.get_start_links)
        
        with open(START_LINKS_PATH, "r") as f:
            for line in f.readlines():
                self.start_urls.append(line.strip())
        f.close()

        yield Request(url=self.start_urls[self.count], callback=self.posts_parse)
        # yield Request(url="https://vieclam24h.vn/mien-bac/viec-lam-chuyen-mon/thiet-ke-my-thuat-c32.html", callback=self.posts_parse)
    
    def get_start_links(self, response):
        urls = response.xpath('//div[@id="gate_nganhnghe_hot"]/div/a/@href').extract()
        with open("./crawler/data/vieclam24h/vieclam24h_start_links.txt", "w") as f:
            for url in urls:
                f.write(url + "\n")
        f.close()
        elements = response.xpath('//div[@id="gate_nganhnghe_hot"]/div')
        for element in elements:
            item = VL24hMajorItem()
            item["major_url"] = element.xpath('./a/@href').extract_first()
            item["name"] = element.xpath('./a/text()').extract_first().strip()

            yield item
    
    def posts_parse(self, response):
        self.count += 1
        self.post_urls.extend(response.xpath('//div[@class="list-item-vlmn load_viec_lam_moi"]/div/div/div/div/a/@href').extract())
        next_page_url = response.xpath('//li[@rel="next"]/a/@href').extract_first()
        if next_page_url:
            if len(self.post_urls) <= NUM_STOP:
                yield Request(url=next_page_url, callback=self.posts_parse)
            else:
                self.post_urls = list(set(self.post_urls))
                for post_url in self.post_urls:
                    url_to_crawl = (BASE_URL+post_url).split(".html")[0] + ".html"
                    yield Request(url=url_to_crawl, callback=self.get_item, dont_filter=True)
                return
            # raise CloseSpider("Num posts exceeded")
        else:
            if self.count < len(self.start_urls):
                yield Request(url=self.start_urls[self.count], callback=self.posts_parse)
    
    def get_item(self, response):
        item = ViecLam24hItem()
        item["title"] = response.xpath('//div[contains(@class, "box_chi_tiet_cong_viec")]/div[1]/div[1]/h1/text()').extract_first().strip()
        item["company_title"] = response.xpath('//div[contains(@class, "box_chi_tiet_cong_viec")]/div[1]/div[1]/p/a/text()').extract_first()
        item["address"] = response.xpath('//address/text()').extract_first()
        item["valid_through"] = ' '.join([x.strip() for x in response.xpath('//div[contains(@class, "box_chi_tiet_cong_viec")]/div[2]/div[1]/span/span/span//text()').extract()])[15:]
        item["salary"] = response.xpath('//div[contains(@class, "job_detail")]/div/p[descendant::i[contains(@class, "icon-money")]]/span/span/text()').extract_first().strip()
        item["job_type"] = response.xpath('//div[contains(@class, "job_detail")]/div/p[descendant::i[contains(@class, "icon-job-type")]]/span/span/text()').extract_first().strip()
        item["num_hiring"] = response.xpath('//div[contains(@class, "job_detail")]/div/p[descendant::i[contains(@class, "icon-quantity")]]/span/span/text()').extract_first().strip()
        item["position"] = response.xpath('//div[contains(@class, "job_detail")]/div/p[descendant::i[contains(@class, "icon-position")]]/span/span/text()').extract_first().strip()
        item["experience"] = response.xpath('//div[contains(@class, "job_detail")]/div/p[descendant::i[contains(@class, "icon-exp")]]/span/span/text()').extract_first().strip()
        item["gender"] = response.xpath('//div[contains(@class, "job_detail")]/div/p[descendant::i[contains(@class, "icon-gender")]]/span/span/text()').extract_first().strip()          
        item["workplace"] = ', '.join(response.xpath('//div[contains(@class, "job_detail")]/div/p[descendant::i[contains(@class, "icon-address")]]/span/a/text()').extract())
        item["img"] = response.xpath('//div[@class="logo-company"]/img/@src').extract_first()
        item["description"] = ''.join(response.xpath('//div[@id="ttd_detail"]/div/div[2]/div[1]/descendant::p[contains(@class, "word_break")]/text()').extract())
        item["job_benefits"] = ''.join(response.xpath('//div[@id="ttd_detail"]/div/div[2]/div[2]/descendant::p[contains(@class, "word_break")]/text()').extract())
        item["extra_requirements"] = ''.join(response.xpath('//div[@id="ttd_detail"]/div/div[2]/div[3]/descendant::p[contains(@class, "word_break")]/text()').extract())
        item["majors"] = response.xpath('//div[contains(@class, "job_detail")]/div/div[descendant::i[contains(@class, "icon-career")]]/h2/a/text()').extract()
        item["qualification"] = response.xpath('//div[contains(@class, "job_detail")]/div/p[descendant::i[contains(@class, "icon-edu")]]/span/span/text()').extract_first()
        company_url = response.xpath('//div[contains(@class, "box_chi_tiet_cong_viec")]/div[1]/div[1]/p/a/@href').extract_first()
        item["company_url"] = company_url.replace("www.", "")
        item["post_url"] = response.url.replace("www.", "")
        item["contact_name"] = response.xpath('//*[@id="ttd_detail"]/div[2]/div[2]/p/text()').extract_first().strip()

        yield item
        if company_url not in self.company_url_list:
            self.company_url_list.append(company_url)
            yield Request(url=company_url, callback=self.get_company, dont_filter=True)
    
    def get_company(self, response):
        item = VL24hCompanyItem()
        item["name"] = response.xpath('//div[@id="box_chi_tiet_nha_tuyen_dung"]/div/div/h1/text()').extract_first()
        item["company_url"] = response.url.replace("www.", "")
        item["description"] = ''.join(response.xpath('//div[contains(@class, "company-description")]//text()').extract())
        item["address"] = ''.join([x.strip() for x in response.xpath('//div[@id="box_chi_tiet_nha_tuyen_dung"]/div/div/div/p[descendant::i[contains(@class, "icon-address-blue")]]//text()').extract() if x.strip() != ""])

        yield item