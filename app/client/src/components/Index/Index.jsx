import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getPosts } from "../../actions/post.action";
import { getUserRecommend } from "../../actions/recommend.action";
import Search from "../Search/Search";
import BGFact from "../../assets/img/bg-facts.jpg";
import {
  getPostById,
  searchPosts,
  getDataAutoComplete,
  getLikedPosts,
} from "../../actions/post.action";
import TheJobs from "../../assets/img/logo2.png";
import { Link } from "react-router-dom";
import { getUserByUserId, autoUpdateUser } from "../../actions/user.action";
import AutoCompleteText from "../HOC/AutoCompleteText";
import { normalizeLongName, normalizeWorkPlaces } from "../../utils/utils";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postsDisplay: [],
      recommendedPosts: [],
      dataAuto: {},
      name: "",
      redirect: false,
      redirectPost: false,
    };
  }

  onChange(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  }

  getChildStatePagination = (data) => {
    this.setState({
      ...this.state,
      postsDisplay: data.resultPosts,
    });
  };

  getChildState = (data) => {
    if (data.name === "name") {
      this.setState({
        ...this.state,
        name: data.text,
      });
    }
  };

  async onSubmit(e) {
    e.preventDefault();
    const name = this.state.name;
    let searchData = {
      major: [name],
      size: 20,
      page: 1,
    };

    await this.props.searchPosts(searchData);
    this.setState({
      ...this.state,
      postsDisplay: this.props.posts.searchResults.posts,
    });
  }

  async componentDidMount() {
    if (this.props.posts.autoComplete === null) {
      await this.props.getDataAutoComplete();
    }

    if (this.props.auth.isAuthenticated) {
      await this.props.getUserByUserId(localStorage.userId);
      if (
        this.props.user.user.qualification === null ||
        this.props.user.user.salary === null ||
        this.props.user.user.Majors.length === 0 ||
        this.props.user.user.WorkPlaces.length === 0
      ) {
        if (this.props.location.postId) {
          this.setState({
            ...this.state,
            redirectPost: true,
          });
        } else {
          this.props.history.push("/updateUser");
        }
      } else {
        if (this.props.recommend.userRecommend.length === 0) {
          await this.props.getLikedPosts();
          let likedPosts = this.props.posts.likedPosts;
          await this.props.getUserRecommend({
            userId: this.props.user.user.userId,
            Majors: this.props.user.user.Majors,
            WorkPlaces: this.props.user.user.WorkPlaces,
            experience: this.props.user.user.experience,
            gender: this.props.user.user.gender,
            job_type: this.props.user.user.job_type,
            qualification: this.props.user.user.qualification,
            salary: this.props.user.user.salary,
            year_of_birth: this.props.user.user.year_of_birth,
          });

          await this.props.autoUpdateUser({
            user: this.props.user.user,
            posts: likedPosts,
          });
        }

        this.setState({
          ...this.state,
          dataAuto: this.props.posts.autoComplete,
          recommendedPosts: this.props.recommend.userRecommend,
        });
      }
    }
    await this.props.searchPosts({ size: 5, page: 1 });
    this.setState({
      ...this.state,
      postsDisplay: this.props.posts.searchResults.posts,
    });
  }

  onClick(e) {
    this.setState({
      ...this.state,
      redirect: true,
    });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/advancedSearch",
            prev: {
              positionTypes: "",
              workplaces: "",
              majors: this.state.name,
            },
          }}
        />
      );
    }
  };

  render() {
    const { postsDisplay, recommendedPosts, dataAuto } = this.state;

    let recentJobs =
      postsDisplay.length === 0 ? (
        <div className="d-flex justify-content-center" style={{textAlign: "center"}}>
          <h4>
            0 có <i>kết quả trả về</i>
          </h4>
        </div>
      ) : (
        postsDisplay.slice(0, 5).map((post) => {
          return (
            <div className="col-xs-12">
              <a className="item-block" href={`/post/${post.postId}`}>
                <header>
                  {post.Companies[0].img_url ||
                  post.Companies[0].img_url !== "" ? (
                    <img src={post.Companies[0].img_url} alt="" />
                  ) : (
                    <img src={TheJobs} alt="Logo" />
                  )}
                  <div className="hgroup">
                    <h4>{normalizeLongName(post.title)}</h4>
                    <h5>{normalizeLongName(post.Companies[0].name)}</h5>
                  </div>
                  <div className="header-meta">
                    <span className="location">
                      {normalizeWorkPlaces(post.WorkPlaces)}
                    </span>
                  </div>
                </header>
                <footer>
                  {this.props.auth.isAuthenticated ? (
                    <>
                      <label>Mức lương:</label>
                      <span className="label label-success">
                        {" "}
                        {post.salary_type}
                      </span>
                    </>
                  ) : (
                    <span>
                      <h6>
                        Bạn cần{" "}
                        <Link to="/login" style={{ color: "red" }}>
                          ĐĂNG NHẬP
                        </Link>{" "}
                        để xem được mức lương
                      </h6>
                    </span>
                  )}
                </footer>
              </a>
            </div>
          );
        })
      );

    let recommendedJobs =
      recommendedPosts.length === 0 ? (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      ) : (
        recommendedPosts.slice(0, 5).map((post) => {
          return (
            <div className="col-xs-12">
              <a className="item-block" href={`/post/${post.post.postId}`}>
                <header>
                  {post.post.img || post.post.img !== "" ? (
                    <img src={post.post.img} alt="" />
                  ) : (
                    <img src={TheJobs} alt="logo" />
                  )}
                  <div className="hgroup">
                    <h4>{normalizeLongName(post.post.title)}</h4>
                    <h5>{normalizeLongName(post.post.name)}</h5>
                  </div>
                  <div className="header-meta">
                    <span className="location">
                      {normalizeWorkPlaces(post.post.WorkPlaces.split(","))}
                    </span>
                    <span className="label label-success">
                      {post.post.salary_type}
                    </span>
                  </div>
                </header>
              </a>
            </div>
          );
        })
      );

    return (
      <>
        {this.renderRedirect()}
        {this.state.redirectPost ? (
          <Redirect
            to={{ pathname: `/updateUser`, postId: this.props.location.postId }}
          />
        ) : (
          <></>
        )}
        <Search />
        <main>
          {this.props.auth.isAuthenticated ? (
            <section>
              <div className="container">
                <header className="section-header">
                  <h2>Công việc gợi ý cho bạn</h2>
                </header>

                <div className="row item-blocks-condensed">
                  {recommendedJobs}
                </div>
                <br />
                <br />
                <p className="text-center">
                  <Link to="/recommend" className="btn btn-primary">
                    Xem thêm
                  </Link>
                </p>
              </div>
            </section>
          ) : (
            <></>
          )}

          <section className="bg-alt">
            <div className="container">
              <header className="section-header">
                <span>Gần nhất</span>
                <h2>Các công việc mới được cập nhật</h2>
                <p>
                  Dưới đây là 5 công việc được cập nhật gần nhất trên hệ thống
                </p>
                <div className="container">
                  <form action="#" onSubmit={(e) => this.onSubmit(e)}>
                    <div className="row">
                      <div className="form-group col-xs-12 col-sm-2">
                        <label>Tên tiêu đề: </label>
                      </div>
                      <div className="form-group col-xs-12 col-sm-10">
                        <AutoCompleteText
                          name="name"
                          items={dataAuto.majors}
                          value={this.state.name}
                          getChildState={this.getChildState}
                          placeholder="Tên ngành nghề"
                        />
                      </div>
                    </div>
                    <div className="button-group">
                      <div className="action-buttons">
                        <button className="btn btn-primary">Tìm kiếm</button>
                      </div>
                    </div>
                  </form>
                </div>
              </header>

              <div className="row item-blocks-condensed">{recentJobs}</div>

              <br />
              <br />
              <p className="text-center">
                <a className="btn btn-primary" onClick={(e) => this.onClick(e)}>
                  Xem thêm
                </a>
              </p>
            </div>
          </section>

          {/* <section className="bg-alt">
            <div className="container">
              <header className="section-header">
                <span>Categories</span>
                <h2>Popular jobs</h2>
                <p>Here's the most popular categories</p>
              </header>

              <div className="category-grid">
                <a href="#">
                  <i className="fa fa-laptop"></i>
                  <h6>Technology</h6>
                  <p>
                    Designer, Developer, IT Service, Front-end developer,
                    Project management
                  </p>
                </a>

                <a href="#">
                  <i className="fa fa-line-chart"></i>
                  <h6>Accounting</h6>
                  <p>
                    Finance, Tax service, Payroll manager, Book keeper, Human
                    resource
                  </p>
                </a>

                <a href="#">
                  <i className="fa fa-medkit"></i>
                  <h6>Medical</h6>
                  <p>Doctor, Nurse, Hospotal, Dental service, Massagist</p>
                </a>

                <a href="#">
                  <i className="fa fa-cutlery"></i>
                  <h6>Food</h6>
                  <p>Restaurant, Food service, Coffe shop, Cashier, Waitress</p>
                </a>

                <a href="#">
                  <i className="fa fa-newspaper-o"></i>
                  <h6>Media</h6>
                  <p>Journalism, Newspaper, Reporter, Writer, Cameraman</p>
                </a>

                <a href="#">
                  <i className="fa fa-institution"></i>
                  <h6>Government</h6>
                  <p>Federal, Law, Human resource, Manager, Biologist</p>
                </a>
              </div>

              <p className="text-center">
                <a className="btn btn-info" href="">
                  Browse all categories
                </a>
              </p>
            </div>
          </section> */}

          {/* <section
            className="bg-img text-center"
            style={{
              backgroundImage: `url(${BGFact})`,
            }}
          >
            <div className="container">
              <h2>
                <strong>Đăng ký</strong>
              </h2>

              <br />
              <br />
              <form className="form-subscribe" action="#">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control input-lg"
                    placeholder="Địa chỉ email"
                  />
                  <span className="input-group-btn">
                    <button className="btn btn-success btn-md" type="submit">
                      Đăng ký
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </section> */}
        </main>
      </>
    );
  }
}

Index.propTypes = {
  posts: PropTypes.object.isRequired,
  wishlist: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired,
  getPostById: PropTypes.func.isRequired,
  getPosts: PropTypes.func.isRequired,
  getUserRecommend: PropTypes.func.isRequired,
  getLikedPosts: PropTypes.func.isRequired,
  searchPosts: PropTypes.func.isRequired,
  getDataAutoComplete: PropTypes.func.isRequired,
  autoUpdateUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  user: state.user,
  auth: state.auth,
  wishlist: state.wishlist,
  recommend: state.recommend,
});

const mapDispatchToProps = {
  getPosts,
  getPostById,
  getUserByUserId,
  getUserRecommend,
  getLikedPosts,
  searchPosts,
  getDataAutoComplete,
  autoUpdateUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
