from scrapy.utils.project import get_project_settings
from scrapy.crawler import CrawlerProcess, CrawlerRunner
from .mywork import MyWorkCrawler
from .timviecnhanh import TVNCrawler
from .topcv import TopCVCrawler
from .vieclam24h import ViecLam24hCrawler
from .viectotnhat import VTNCrawler
from twisted.internet import reactor
from scrapy.utils.log import configure_logging
from ..push_to_db import DBPushing
import time, os, sys, json
from ..constants import CRAWLED_DATA


def crawl():
    configure_logging()
    settings = get_project_settings()
    runner = CrawlerRunner(settings)
    runner.crawl(MyWorkCrawler)
    runner.crawl(TVNCrawler)
    runner.crawl(TopCVCrawler)
    runner.crawl(ViecLam24hCrawler)
    runner.crawl(VTNCrawler)
    d = runner.join()
    d.addBoth(lambda _: reactor.stop())

    reactor.run()
    time.sleep(0.5)

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
push_to_db()
os.execl(sys.executable, sys.executable, *sys.argv)