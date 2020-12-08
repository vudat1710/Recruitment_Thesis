from template import *
import json
import pandas as pd
from math import sqrt
import pprint
import pickle

def nominal_attr(u, x):
    if u == x:
        return 1
    else: return 0

def experience_attr(u, x):
    if x == 99 or u == 99:
        if u == 99 and x == 99:
            return 1
        else:
            return 1 - u / 8
    else:
        if u > x:
            return 0.1
        else:
            return (1 - (x - u) / 5)

def gender_attr(u, x):
    if x == "Không yêu cầu" or x == "Không yêu cầu":
        if u == "Không yêu cầu" and x == "Không yêu cầu":
            return 1
        return 0.9
    else:
        return nominal_attr(u,x)

def salary_attr(u, x):
    if x == "Thoả thuận" or u == "Thoả thuận":
        if u == "Thoả thuận" and x == "Thoả thuận":
            return 1
        else:
            return 0.5
    else:
        u_index = SALARY.index(u)
        x_index = SALARY.index(x)

        return 1 - (abs(u_index - x_index) / len(SALARY))


def workplace_qualification_attr(u, x):
    u = set([item.strip() for item in u.split(",")])
    x = set([item.strip() for item in x.split(",")])
    
    if len(u.intersection(x)) != 0:
        return 1
    else:
        return 0

def major_attr(u, x):
    u = set([item.strip() for item in u.split(",")])
    x = set([item.strip() for item in x.split(",")])

    return len(u.intersection(x)) / len(u.union(x))

def get_score_item(source, target):
    gender = gender_attr(source["gender"], target["gender"])
    job_type = nominal_attr(source["job_type"], target["job_type"])
    salary = salary_attr(source["salary_type"], target["salary_type"])
    qualification = workplace_qualification_attr(source["qualification"], target["qualification"])
    workplace = major_attr(source["WorkPlaces"], target["WorkPlaces"])
    major = major_attr(source["Majors"], target["Majors"])
    experience = experience_attr(int(source["experience"]), target["experience"])

    return sqrt(gender ** 2 + job_type ** 2 + salary ** 2 + qualification ** 2 + workplace ** 2 + major ** 2 + experience ** 2)

def prescore_all_items():
    res = []
    posts = json.load(open("/home/vudat1710/Downloads/Thesis/Recruitment_Thesis/all_posts.json", "r"))
    posts = [x for x in posts if x is not None]
    df = pd.DataFrame(posts)
    df['WorkPlaces'] = df['WorkPlaces'].apply(lambda l: ", ".join([x['name'] for x in l]))
    df['Majors'] = df['Majors'].apply(lambda l: ", ".join([x['name'] for x in l]))
    df["experience"] = df["experience"].apply(lambda x: int(x))
    posts = df.to_dict('records')

    for i in range(len(posts)):
        for j in range(len(posts)):
            res.append({"post": posts[i]['postId'], "target": posts[j]["postId"], "score": get_score_item(posts[i], posts[j])})

    pickle.dump(res, open("score.pkl", "wb"))

def test():
    u = {'postId': 9793, 'title': 'Reactjs Frontend', 'gender': 'Nam', 'extra_requirements': '-\tTốt nghiệp Cao Đẳng/Đại Học chuyên ngành CNTT.\n-\tKiến thức tốt về Javascript, ReactJS và các thư viện liên quan. \n-\tKiến thức tốt về HTML/CSS, AJAX và các thư viện / framework liên quan. \n-\tBiêt thiết kế giao diện người dùng UI/UX là một lợi thế lớn. \n-\tĐọc hiểu tài liệu tiếng Anh chuyên ngành. \n-\tCó kỹ năng phân tích và giải quyết vấn đề. \nƯu tiên: \n-\tFull-stack developer. \n-\tĐã có kinh nghiệm thực tế với Node.js hoặc React. \n-\tCó kinh nghiệm sử dụng và giải quyết vấn đề đối với các hệ thống Linux. \n-\tCó kinh nghiệm thiết kế và triển khai các ứng dụng “low-latency”, “high-availability”, “high-performance”. \n-\tCó hiểu biết về Docker/Container. ', 'description': '-\tLàm việc trong nhóm phát triển các ứng dụng và dịch vụ theo phương pháp Agile.\n-\tĐóng góp cho bộ phận và tổ chức để nâng cao quy trình, hiệu quả công việc. \n-\tXây dựng giao diện người dùng (đối với frontend developer) và giao diện dịch vụ/API (đối với backend developer). \n-\tCode, test và vận hành các dịch vụ. ', 'job_benefits': "- Gia nhập FPT, bạn sẽ được làm việc tại một trong môi trường làm việc hàng đầu Việt Nam, chúng tôi sẽ mang đến cho bạn:\n- Cơ hội tiếp cận các công nghệ hiện đại nhất hiện nay, bạn sẽ được cung cấp đầy đủ các thiết bị như máy tính để bàn, điện thoại cố định,... để phục vụ cho công việc. \n- Thu nhập hấp dẫn, chế độ khen thưởng phong phú, cụ thể: \n+ Lương: bao gồm mức lương cứng dựa trên năng lực + lương doanh số (đối với NVKD) hoặc phụ cấp (đối với NV kỹ thuật) \n+ Thưởng lương tháng 13 \n+ Thưởng hiệu quả kinh doanh theo KPI \n+ Các chế độ khen thưởng hàng tháng, thưởng du lịch nước ngoài cuối năm đối với NV xuất sắc. \n+ Chế độ nghỉ mát hàng năm là 4 triệu đồng/nhân viên \n- Bảo hiểm y tế, bảo hiểm xã hội theo quy định của luật lao động, bảo hiểm cao cấp FPT Care để khám chữa bệnh miễn phí. \n- Được học hỏi, đào tạo bởi các chuyên gia hàng đầu tại tập đoàn công nghệ số 1 Việt Nam. Cơ hội tham gia đào tạo các chứng chỉ quốc tế. \n- Tham gia các cuộc thi tìm kiếm nhân tài, cơ hội thăng tiến lên các vị trí quản lý \n- Các hoạt động tập thể phong phú: thể dục thể thao, các hoạt động công đoàn như: Men's day, woman's day, quà cho con em CBNV trong ngày Quốc tế thiếu nhi. \nVới đội ngũ trẻ, năng động, tài năng, cùng với một nền văn hóa vô cùng đặc biệt, chúng tôi tự tin là môi trường làm việc hàng đầu giúp bạn phát huy tính sáng tạo và tài năng của bản thân. ", 'salary_type': '15-20 triệu', 'min_value': 20, 'max_value': 20, 'experience': 2, 'job_type': 'Toàn thời gian', 'num_hiring': None, 'valid_through': '2020-12-27', 'address': 'Tầng 12A – Tòa nhà TNR, 54A Nguyễn Chí Thanh, Phường Láng Hạ, Quận Đống Đa, TP.Hà Nội.', 'post_url': 'https://topcv.vn/viec-lam/reactjs-frontend-designer-ui-ux/321244.html', 'qualification': 'Cao đẳng, Đại học', 'position': 'Nhân viên', 'contact_name': None, 'Companies': [{'name': 'Công Ty TNHH MTV Viễn Thông Quốc Tế FPT', 'description': ' là một trong những nhà cung cấp dịch vụ Viễn thông hàng đầu Việt Nam. Với hơn 10 năm kinh nghiệm, FPT Telecom International không ngừng mang đến các sản phẩm, dịch vụ đổi mới, nắm bắt sự thay đổi trong cách thức giao tiếp, làm việc của con người và các tổ chức trong thời đại kỹ thuật số đang phát triển rất nhanh. Tại FPT Telecom International, chúng tôi luôn nỗ lực làm việc để gia tăng giá trị và nâng cao sức mạnh thương hiệu. Bằng quá trình hợp tác cùng rất nhiều đối tác, quy mô công ty, năng lực tiếp cận khách hàng và kinh nghiệm hoạt động sâu rộng đã đưa chúng tôi trở thành công ty hàng đầu trong lĩnh vực công nghệ điện tử viễn thông. Chúng tôi tự hào với đội ngũ nhân sự kỹ thuật cao và là nền tảng vững chắc cho sự phát triển của công ty. 100% nhân sự kỹ thuật của chúng tôi được đào tạo tại các trường Đại học uy tín trong lĩnh vực công nghệ, cùng nhiều chuyên gia có kinh nghiệm làm việc nhiều năm tại các công ty công nghệ hàng đầu như: Microsoft, Oracle, SUN, Cisco, Juniper, Sonic Wall, DELL, HP và đạt các chứng chỉ quốc tế cao cấp. Trong lĩnh vực tích hợp hệ thống, chúng tôi đã hợp tác với các đối tác công nghệ như Cisco, Juniper, Dell, HP, IBM, Microsoft, Vmware trong nhiều năm và đã triển khai thành công nhiều dự án lớn trong và ngoài nước, cũng như cùng các đối tác tổ chức các khóa đòa tạo để nâng cao trình độ chuyên môn nhân sự. Qua đó, đội ngũ nhân sự của chúng tôi đã tích lũy được nhiều kiến thức, kinh nghiệm quý giá và đạt được nhiều chứng chỉ chuyên môn giá trị như Cisco CCNA, CCSP, CCNP, CCIE, VMWare VSP, VTSP, VCP, Juniper JNCIP, JNCIE , Microsoft MCITP, MCSA, MCSE, Linux +, McAfee, AWS CSA. FPT Telecom International tin rằng một đội ngũ nhân sự mạnh và tài năng sẽ mang lại sự thành công bềnvững cho tổ chức. Vì vậy, chúng tôi luôn dành sự quan tâm và đầu tư trong việc thu hút, giữ chân nhântài là các chuyên gia công nghệ và viễn thông hàng đầu. Chúng tôi cũng rất tự hào khi có những chuyêngia số 1 Việt Nam chuyên sâu về các lĩnh vực công nghệ mạng, viễn thông và quản trị hệ thống trong độingũ của chúng tôi. Chúng tôi cam kết mang lại một môi trường làm việc cạnh tranh công bằng, đánh giá trên hiệu suất làm việc và chính sách phúc lợi tốt.', 'img_url': 'https://static.topcv.vn/company_logos/cong-ty-tnhh-mtv-vien-thong-quoc-te-fpt-5d898f99a34de.jpg', 'companyId': 2181, 'PostCompany': {'postId': 9793, 'companyId': 2181, 'id': 9794}}], 'CommentPosts': [], 'RatePosts': [], 'WorkPlaces': 'Hà Nội', 'Majors': 'CNTT - Phần mềm, CNTT - Phần cứng / Mạng, Điện tử viễn thông'}
    posts = json.load(open("/home/vudat1710/Downloads/Thesis/Recruitment_Thesis/all_posts.json", "r"))
    posts = [x for x in posts if x is not None]
    df = pd.DataFrame(posts)
    df['WorkPlaces'] = df['WorkPlaces'].apply(lambda l: ", ".join([x['name'] for x in l]))
    df['Majors'] = df['Majors'].apply(lambda l: ", ".join([x['name'] for x in l]))
    df["experience"] = df["experience"].apply(lambda x: int(x))
    # posts = df[df["majors"].str.contains("CNTT")].to_dict('records')
    posts = df.to_dict('records')

    res = []

    for post in posts:
        score = get_score_item(u, post)
        res.append({"post": post, "score": score})

    pprint.pprint(sorted(res, key=lambda x: x["score"], reverse=True)[:10])

# test()