from scrapy.utils.project import get_project_settings
from scrapy.crawler import CrawlerProcess, CrawlerRunner
from .mywork import MyWorkCrawler
from .timviecnhanh import TVNCrawler
from .topcv import TopCVCrawler
from .vieclam24h import ViecLam24hCrawler
from .viectotnhat import VTNCrawler
from twisted.internet import reactor, defer
from scrapy.utils.log import configure_logging
from ..push_to_db import DBPushing
import time, os, sys, json
from ..constants import CRAWLED_DATA

configure_logging()
settings = get_project_settings()
runner = CrawlerRunner(settings)

@defer.inlineCallbacks
def crawl():  
    yield runner.crawl(MyWorkCrawler)
    yield runner.crawl(TVNCrawler)
    yield runner.crawl(TopCVCrawler)
    yield runner.crawl(VTNCrawler)
    reactor.stop()

def push_to_db():
    for folder_name in os.listdir(CRAWLED_DATA):
        posts = json.load(open(CRAWLED_DATA + folder_name + "/post.json", "r"))
        companies = json.load(open(CRAWLED_DATA + folder_name + "/company.json", "r"))
        dbp = DBPushing(posts, companies)
        posts_with_company = dbp.check_posts()
        print(len(posts_with_company))
        dbp.insert_to_db(posts_with_company)
        dbp.connection.close()


crawl()
reactor.run()
time.sleep(5)
# push_to_db()

