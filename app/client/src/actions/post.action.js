import {
  GET_POSTS,
  GET_NUM_POSTS,
  GET_DATA_AUTOCOMPLETE,
  SEARCH_POSTS,
} from "./actionTypes";
import axios from "axios";

export const getPosts = (params) => async (dispatch) => {
  // let res = await axios.post(`/api/here`, params);

  dispatch({
    type: GET_POSTS,
    payload: {
      // results: {"response": res.data, "type": params.type, "numPosts": res.data.length},
      results: {
        response: [
          {
            title: "Nhân Viên Chăm Sóc Khách Hàng",
            companyTitle: "Công Ty TNHH In I-Print",
            img: "https://mywork.com.vn//employer-no-image.png",
            workplace: "Hồ Chí Minh",
            salary: "7 triệu - 15 triệu",
          },
          {
            title:
              "Nhân Viên Kinh Doanh Tại Hà Nội, Hồ Chí Minh Lương 10 Triệu Trở Lên",
            companyTitle: "Công Ty TNHH Thương Mại Godo",
            img:
              "https://cdn1.mywork.com.vn/company-logo-small/082020/fa2adad184e64da259b0e794a5aea372.jpg",
            workplace: "Hà Nội, Hồ Chí Minh",
            salary: "12 triệu - 15 triệu",
          },
          {
            title: "Chuyên Viên Kinh Doanh Lương 15 Triệu / Tháng",
            companyTitle:
              "Công Ty Cổ Phần Tư Vấn Và Đầu Tư Bất Động Sản An Khang",
            img:
              "https://cdn1.mywork.com.vn/company-logo-small/082020/52f59061b3d5af54dee9e02547370da9.jpg",
            workplace: "Hồ Chí Minh",
            salary: "Trên 30 triệu",
          },
          {
            title: "Nhân Viên Sale (Bắc Từ Liêm, Hà Nội)",
            companyTitle:
              "Công Ty TNHH Tổ Chức Sự Kiện Và Teambuilding Win Star",
            img:
              "https://cdn1.mywork.com.vn/company-logo-small/022020/d0a3d56d0a0bd33f07dd3dded62f925c.png",
            workplace: "Hà Nội",
            salary: "7 triệu - 10 triệu",
          },
          {
            title:
              "Sale Admin - Chăm Sóc Khách Hàng Lương Trên 10 Triệu Tại Tân Triều-Thanh",
            companyTitle: "Công Ty TNHH Cơ Điện Lạnh Eriko",
            img:
              "https://cdn1.mywork.com.vn/company-logo-small/201712/3d6492f9de9d.png",
            workplace: "Hà Nội",
            salary: "10 triệu - 18 triệu",
          },
        ],
        type: params.getType,
        numPosts: 1000,
      },
      params: params,
    },
  });
};

export const getNumAllPosts = () => async (dispatch) => {
  // let res = await axios.post(`api/here`);

  dispatch({
    type: GET_NUM_POSTS,
    payload: {
      // numPosts: res.data
      numAllPosts: 10000,
    },
  });
};

export const getDataAutoComplete = () => async (dispatch) => {
  // const res = await axios.get(`Books/autoCompleted`);
  dispatch({
    type: GET_DATA_AUTOCOMPLETE,
    payload: {
      positions: ["Nhan vien ban hang", "Ky su IT"],
      workplaces: ["Ha Noi", "Nam Dinh"],
      majors: ["Ban hang", "An toan lao dong"],
      salary: ["5-7trieu", "11-17trieu"],
      jobTypes: ["Ban thoi gian", "Toan thoi gian"],
      experience: ["1 nam", "2 nam", "3 nam"],
    },
  });
};

export const searchPosts = (searchParams) => async (dispatch) => {
  //   const res = await axios.post(`Books/search`, { reqData: searchParams });
  dispatch({
    type: SEARCH_POSTS,
    // payload: res.data,
    payload: [
      {
        title: "Nhân Viên Chăm Sóc Khách Hàng",
        companyTitle: "Công Ty TNHH In I-Print",
        img: "https://mywork.com.vn//employer-no-image.png",
        workplace: "Hồ Chí Minh",
        salary: "7 triệu - 15 triệu",
      },
      {
        title:
          "Nhân Viên Kinh Doanh Tại Hà Nội, Hồ Chí Minh Lương 10 Triệu Trở Lên",
        companyTitle: "Công Ty TNHH Thương Mại Godo",
        img:
          "https://cdn1.mywork.com.vn/company-logo-small/082020/fa2adad184e64da259b0e794a5aea372.jpg",
        workplace: "Hà Nội, Hồ Chí Minh",
        salary: "12 triệu - 15 triệu",
      },
      {
        title: "Chuyên Viên Kinh Doanh Lương 15 Triệu / Tháng",
        companyTitle: "Công Ty Cổ Phần Tư Vấn Và Đầu Tư Bất Động Sản An Khang",
        img:
          "https://cdn1.mywork.com.vn/company-logo-small/082020/52f59061b3d5af54dee9e02547370da9.jpg",
        workplace: "Hồ Chí Minh",
        salary: "Trên 30 triệu",
      },
      {
        title: "Nhân Viên Sale (Bắc Từ Liêm, Hà Nội)",
        companyTitle: "Công Ty TNHH Tổ Chức Sự Kiện Và Teambuilding Win Star",
        img:
          "https://cdn1.mywork.com.vn/company-logo-small/022020/d0a3d56d0a0bd33f07dd3dded62f925c.png",
        workplace: "Hà Nội",
        salary: "7 triệu - 10 triệu",
      },
      {
        title:
          "Sale Admin - Chăm Sóc Khách Hàng Lương Trên 10 Triệu Tại Tân Triều-Thanh",
        companyTitle: "Công Ty TNHH Cơ Điện Lạnh Eriko",
        img:
          "https://cdn1.mywork.com.vn/company-logo-small/201712/3d6492f9de9d.png",
        workplace: "Hà Nội",
        salary: "10 triệu - 18 triệu",
      },
    ],
  });
};
