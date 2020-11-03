from scrapy.utils.project import get_project_settings
from scrapy.crawler import CrawlerProcess, CrawlerRunner
from .mywork import MyWorkCrawler
from .timviecnhanh import TVNCrawler
from .topcv import TopCVCrawler
from .vieclam24h import ViecLam24hCrawler
from .viectotnhat import VTNCrawler
from twisted.internet import reactor
from scrapy.utils.log import configure_logging
import time, os, sys


# configure_logging()
# settings = get_project_settings()
# # process = CrawlerProcess(settings)
# # process.crawl(MyWorkCrawler)
# # process.crawl(TVNCrawler)
# # process.crawl(TopCVCrawler)
# # process.crawl(ViecLam24hCrawler)
# # process.crawl(VTNCrawler)
# # process.start()
# # process.join()
# runner = CrawlerRunner(settings)
# runner.crawl(MyWorkCrawler)
# runner.crawl(TVNCrawler)
# runner.crawl(TopCVCrawler)
# runner.crawl(ViecLam24hCrawler)
# runner.crawl(VTNCrawler)
# d = runner.join()
# d.addBoth(lambda _: reactor.stop())

# reactor.run()
# time.sleep(0.5)

# os.execl(sys.executable, sys.executable, *sys.argv)