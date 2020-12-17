cd .
wait
cd /home/vudat1710/Downloads/Thesis/Recruitment_Thesis/crawler
wait
python -m crawler.spiders.crawl
wait
python -m crawler.test
wait
python -m crawler.push_to_db