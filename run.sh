cd .
wait
cd ./crawler
wait
python -m crawler.spiders.crawl $1
wait
python -m crawler.test
wait
python -m crawler.push_to_db $2
