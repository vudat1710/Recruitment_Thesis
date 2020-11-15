CRAWL_SITES = {
    "topcv" : {
        "url": "https://www.topcv.vn/tim-viec-lam-moi-nhat",
        "job_url": '//*[@class="job-title"]/a',
        "next_page_url": '//ul[@class="pagination"]/li[last()]/a'
    },
    "timviecnhanh" : {
        "url": "https://www.timviecnhanh.com/vieclam/timkiem?tu_khoa=&nganh_nghe%5B%5D=&tinh_thanh%5B%5D=",
        "job_url": '//article[contains(@class, "block-content")]/table/tbody/tr/td[1]/a[1]',
        "next_page_url": '//a[@class="next item"]'
    },
    "mywork" : {
        "url": "https://mywork.com.vn/tuyen-dung",
        "job_url": '//p[contains(@class, "j_title")]/a',
        "next_page_url": '//ul[@class="pagination"]/li[last()]/a'
    },
    "vieclam24h" : {
        "url": "https://vieclam24h.vn/tim-kiem-viec-lam-nhanh?hdn_tu_khoa=&tk_select_gate=&hdn_nganh_nghe_cap1=&hdn_dia_diem=&key=ttv_nangcao",
        "job_url": '//span[contains(@class, "title-blockjob-main")]/a',
        "next_page_url": '//li[@class="next"]/a'
    },
    "careerlink" : {
        "url": "https://www.careerlink.vn/vieclam/list?keyword_use=A",
        "job_url": '//div[contains(@class, "list-search-result-group")]/div/h2/a',
        "next_page_url": '//ul[@class="pagination"]/li[last()]/a'
    },
    "careerbuilder" : {
        "url": "https://careerbuilder.vn/viec-lam/tat-ca-viec-lam-vi.html",
        "job_url": '//a[@class="job_link"]',
        "next_page_url": '//li[@class="next-page"]/a'
    },
    "jobsgo" : {
        "url": "https://jobsgo.vn/viec-lam.html",
        "job_url": '//div[@class="brows-job-position"]/div/a',
        "next_page_url": '//li[@class="next"]/a'
    },
}

ADDRESS_DICT_PATH = "./get_data/get_data/template/address.json"
MAJOR_DICT_PATH = "./get_data/get_data/template/major.json"
EXP_DICT_PATH = "./get_data/get_data/template/exp.json"
JOB_TYPE_DICT_PATH = "./get_data/get_data/template/job_type.json"
MEDIATED_SCHEMA_PATH = "./get_data/get_data/template/mediated_schema.json"
STOPWORDS_PATH = "./get_data/get_data/template/vietnamese-stopwords-dash.txt"
SAMPLE_PATH = "./get_data/get_data/sample/"
DATA_PATH = "./get_data/get_data/data/"
CRAWLED_DATA = './crawler/data/'

#DATABASE
USER = "root"
PASSWORD = "17101998"
DATABASE = "recruitment_test"
PORT = 3306