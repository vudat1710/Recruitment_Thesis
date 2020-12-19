import React, { Component } from "react";
import { experienceDict, getSearchData } from "../../utils/utils";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Banner from "../../assets/img/banner_details.jpg";
import {
  getDataAutoComplete,
  searchPosts,
  deletePost,
} from "../../actions/post.action";
import PropTypes from "prop-types";
import AutoCompleteText from "../HOC/AutoCompleteText";
import Pagination from "../Pagination/Pagination";
// import classnames from "classnames";

function assign(obj, value) {
  obj[value] = !obj[value];
  console.log(obj)
  return obj;
}

class ManagePost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      dataAuto: null,
      positionTypes: "",
      workplaces: "",
      majors: "",
      salaryType: "",
      experience: [],
      jobType: [],
      loading: false,
      resultPosts: {},
      experienceSelect: {},
      jobTypeSelect: {},
      page: 1,
      posts: []
    };
  }

  async componentDidMount() {
    await this.props.getDataAutoComplete();
    let experienceSelect = {};
    let jobTypeSelect = {};
    for (let i = 0; i < this.props.posts.autoComplete.experience.length; i++) {
      experienceSelect[this.props.posts.autoComplete.experience[i]] = false;
    }

    for (let i = 0; i < this.props.posts.autoComplete.jobTypes.length; i++) {
      jobTypeSelect[this.props.posts.autoComplete.jobTypes[i]] = false;
    }
    this.setState({
      ...this.state,
      dataAuto: this.props.posts.autoComplete,
      resultPosts: this.props.posts.searchResults,
      positionTypes: this.props.posts.searchParams.position.join(", "),
      workplaces: this.props.posts.searchParams.workplace.join(", "),
      majors: this.props.posts.searchParams.major.join(", "),
      experience: this.props.posts.searchParams.experience,
      jobType: this.props.posts.searchParams.job_type,
      salaryType: this.props.posts.searchParams.salary_type,
      experienceSelect: experienceSelect,
      jobTypeSelect: jobTypeSelect,
      loading: true,
      posts: this.props.posts.searchResults.posts
    });
  }

  onChange(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  }

  onClick(name, value) {
    this.setState((prevState) => ({
      [name]: assign(prevState[name], value),
    }));
  }

  getSearchDataAd() {
    let {
      positionTypes,
      workplaces,
      majors,
      salaryType,
      experienceSelect,
      jobTypeSelect,
    } = this.state;
    if (salaryType === "Tất cả mức lương") {
      salaryType = "";
    }

    let searchData = {
      position:
        positionTypes === ""
          ? []
          : positionTypes.split(",").map((a) => a.trim()),
      workplace:
        workplaces === "" ? [] : workplaces.split(",").map((a) => a.trim()),
      major: majors === "" ? [] : majors.split(",").map((a) => a.trim()),
      experience: Object.keys(experienceSelect).filter(
        (key) => experienceSelect[key] === true
      ),
      job_type: Object.keys(jobTypeSelect).filter(
        (key) => jobTypeSelect[key] === true
      ),
      salary_type: salaryType,
    };

    searchData = getSearchData(searchData);
    searchData.size = 20;

    return searchData;
  }

  getChildState = (data) => {
    if (data.name === "positionTypes") {
      this.setState({
        ...this.state,
        positionTypes: data.text,
      });
    } else if (data.name === "workplaces") {
      this.setState({
        ...this.state,
        workplaces: data.text,
      });
    } else if (data.name === "majors") {
      this.setState({
        ...this.state,
        majors: data.text,
      });
    }
  };

  getChildStatePagination = (data) => {
    this.setState({
      ...this.state,
      resultPosts: data.resultPosts,
      posts: data.resultPosts.posts
    });
  };

  async onDeleteClick(postId) {
    await this.props.deletePost({ postId: postId });
    this.setState({
      ...this.state,
      posts: this.state.posts.filter((a) => a.postId !== postId),
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    let searchData = this.getSearchDataAd();
    searchData.page = 1;

    await this.props.searchPosts(searchData);
    this.setState({
      ...this.state,
      resultPosts: this.props.posts.searchResults,
      posts: this.props.posts.searchResults.posts
    });
  }

  render() {
    const {
      dataAuto,
      loading,
      resultPosts,
      experienceSelect,
      jobTypeSelect,
    } = this.state;

    let searchData = this.getSearchDataAd();
    let PostComp = this.state.posts ? (
      this.state.posts.map((post) => {
        return (
          <div className="col-xs-12">
            <a className="item-block">
              <header>
                <img src={post.Companies[0].img_url} alt="" />
                <div className="hgroup">
                  <h4><a href={`/post/${post.postId}`}>{post.title}</a></h4>
                  <h5>
                    {post.Companies[0].name}{" "}
                    <span className="label label-success">{post.job_type}</span>
                  </h5>
                </div>
                <time datetime="2016-03-10 20:00">
                  Deadline: {post.valid_through}
                </time>
              </header>

              <footer>
                <ul className="details cols-3">
                  <li>
                    <i className="fa fa-map-marker"></i>
                    <span>{post.WorkPlaces.map((a) => a.name).join(", ")}</span>
                  </li>

                  <li>
                    <i className="fa fa-money"></i>
                    <span>{post.salary_type}</span>
                  </li>

                  {post.qualification ? (
                    <li>
                      <i className="fa fa-certificate"></i>
                      <span>{post.qualification}</span>
                    </li>
                  ) : (
                    <></>
                  )}
                  <div class="action-btn">
                    <a class="btn btn-xs btn-gray" href={`/editPost/${post.postId}`}>
                      Edit
                    </a>
                    <a class="btn btn-xs btn-danger" onClick={() => this.onDeleteClick(post.postId)}>
                      Delete
                    </a>
                  </div>
                </ul>
              </footer>
            </a>
          </div>
        );
      })
    ) : (
      <></>
    );

    let pagination =
      resultPosts.totalItems && resultPosts.totalItems > 0 ? (
        <Pagination
          totalPages={resultPosts.totalPages}
          currentPage={resultPosts.currentPage}
          searchData={searchData}
          getChildState={this.getChildStatePagination}
        />
      ) : (
        <></>
      );

    let extraComp = resultPosts.currentPage ? (
      <h5>
        Hệ thống đã tìm thấy <strong>{resultPosts.totalItems}</strong> kết quả,
        bạn đang xem trang thứ <i>{resultPosts.currentPage}</i> trong tổng số{" "}
        <i>{resultPosts.totalPages} trang</i>
      </h5>
    ) : (
      <></>
    );
    if (!loading) {
      return (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      );
    } else {
      const prevSearchData = this.props.location.prev
        ? this.props.location.prev
        : { positionTypes: "", workplaces: "", majors: "" };
      return (
        <>
          <header
            className="page-header bg-img"
            style={{ backgroundImage: `url(${Banner})` }}
          >
            <div className="container page-name">
              <h1 className="text-center">
                Quản lý các bài đăng trên hệ thống
              </h1>
              <p className="lead text-center">
                Lựa chọn các tiêu chí dưới đây để tìm bài đăng
              </p>
            </div>

            <div className="container">
            <div className="col-xs-12 text-right">
              <br/>
              <Link className="btn btn-primary btn-sm" to={{pathname: `/addPost`,  type: "add"}}>Thêm bài đăng</Link>
            </div>
            <div style={{height: 70}}/>
              <form action="#" onSubmit={(e) => this.onSubmit(e)}>
                <div className="row">
                  <div className="form-group col-xs-12 col-sm-4">
                    <AutoCompleteText
                      name="positionTypes"
                      items={dataAuto.positions}
                      value={prevSearchData.positionTypes}
                      getChildState={this.getChildState}
                      placeholder="Vị trí mong muốn ứng tuyển"
                    />
                  </div>

                  <div className="form-group col-xs-12 col-sm-4">
                    <AutoCompleteText
                      name="workplaces"
                      items={dataAuto.workplaces}
                      value={prevSearchData.workplaces}
                      getChildState={this.getChildState}
                      placeholder="Địa điểm làm việc"
                    />
                  </div>

                  <div className="form-group col-xs-12 col-sm-4">
                    <AutoCompleteText
                      name="majors"
                      items={dataAuto.majors}
                      value={prevSearchData.majors}
                      getChildState={this.getChildState}
                      placeholder="Ngành nghề mong muốn"
                    />
                  </div>

                  <div className="form-group col-xs-12 col-sm-4">
                    <select
                      className="form-control"
                      name="salaryType"
                      onClick={(e) => this.onChange(e)}
                    >
                      <option defaultValue>Tất cả mức lương</option>
                      {dataAuto.salary_types.map((s) => {
                        return <option value={s}>{s}</option>;
                      })}
                    </select>
                  </div>

                  <div className="form-group col-xs-12 col-sm-4">
                    <h6>Kinh nghiệm</h6>
                    {/* <div className="radio"> */}
                    {Object.keys(this.state.experienceSelect).map((ex) => {
                      // console.log(this.state.experienceSelect)
                      return (
                        <div className="checkbox">
                          <input
                            type="checkbox"
                            id={ex}
                            checked={experienceSelect[ex]}
                            name="experience"
                            value={ex}
                            onClick={() => this.onClick("experienceSelect", ex)}
                          />
                          <label htmlFor={ex}>{experienceDict[ex]}</label>
                        </div>
                      );
                    })}
                    {/* </div> */}
                  </div>

                  <div className="form-group col-xs-12 col-sm-4">
                    <h6>Hình thức làm việc</h6>
                    {/* <div className="radio"> */}
                    {Object.keys(this.state.jobTypeSelect).map((jT) => {
                      return (
                        <div className="checkbox">
                          <input
                            type="checkbox"
                            id={jT}
                            checked={jobTypeSelect[jT]}
                            value={jT}
                            name="jobType"
                            onClick={() => this.onClick("jobTypeSelect", jT)}
                          />
                          <label htmlFor={jT}>{jT}</label>
                        </div>
                      );
                    })}
                    {/* </div> */}
                  </div>
                </div>

                <div className="button-group">
                  <div className="action-buttons">
                    <button className="btn btn-primary">Tìm kiếm</button>
                    {/* <button className="btn btn-primary"></button> */}
                  </div>
                </div>
              </form>
            </div>
          </header>

          <main>
            <section className="no-padding-top bg-alt">
              <div style={{ height: 80 }}></div>
              <div className="container">
                <div className="row item-blocks-condensed">
                  <div className="col-xs-12">
                    <br />
                    {extraComp}
                  </div>

                  {PostComp}
                </div>

                <nav className="text-center">{pagination}</nav>
              </div>
            </section>
          </main>
        </>
      );
    }
  }
}

ManagePost.propTypes = {
  posts: PropTypes.object.isRequired,
  getDataAutoComplete: PropTypes.func.isRequired,
  searchPosts: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ posts: state.posts });

const mapDispatchToProps = {
  getDataAutoComplete,
  searchPosts,
  deletePost,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePost);
