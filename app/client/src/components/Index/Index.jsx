import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getPosts } from "../../actions/post.action";
import { getUserRecommend } from "../../actions/recommend.action";
import Search from "../Search/Search";
import HowItWork from "../../assets/img/job-vacancy.jpg";
import BGFact from "../../assets/img/bg-facts.jpg";
import { getPostById } from "../../actions/post.action";
import { getWishList } from "../../actions/wishlist.action";
import { Link, withRouter } from "react-router-dom";
import { getUserByUserId } from "../../actions/user.action";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postsDisplay: [],
      recommendedPosts: [],
    };
  }

  async componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      await this.props.getUserByUserId(localStorage.userId);
      if (
        this.props.user.user.qualification === null ||
        this.props.user.user.salary === null ||
        this.props.user.user.Majors.length === 0 ||
        this.props.user.user.WorkPlaces.length === 0
      ) {
        this.props.history.push("/updateUser");
      } else {
        if (this.props.recommend.userRecommend.length === 0) {
          await this.props.getWishList(this.props.user.user.userId);
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
            RatePosts: this.props.user.user.RatePosts,
            wishlist: this.props.wishlist.posts.map((a) => a.postId),
          });
        }

        this.setState({
          ...this.state,
          recommendedPosts: this.props.recommend.userRecommend,
        });
      }
    }
    await this.props.getPosts({
      type: "home",
      limit: 5,
      // attributes: ["postId", "title", "salary_type", "valid_through"],
    });
    this.setState({
      ...this.state,
      postsDisplay: this.props.posts.postData,
    });
  }

  render() {
    const { postsDisplay, recommendedPosts } = this.state;
    console.log(postsDisplay);
    let recentJobs =
      postsDisplay.length === 0 ? (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      ) : (
        postsDisplay.map((post) => {
          let workplace = post.WorkPlaces.map(function (ele) {
            return ele.name;
          }).join(", ");
          return (
            <div className="col-xs-12">
              <a className="item-block" href={`/post/${post.postId}`}>
                <header>
                  <img src={post.Companies[0].img_url} alt="" />
                  <div className="hgroup">
                    <h4>{post.title}</h4>
                    <h5>{post.Companies[0].name}</h5>
                  </div>
                  <div className="header-meta">
                    <span className="location">{workplace}</span>
                  </div>
                </header>
                <footer>
                  {this.props.auth.isAuthenticated ? (
                    <span className="label label-success">
                      {post.salary_type}
                    </span>
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
        recommendedPosts.map((post) => {
          return (
            <div className="col-xs-12">
              <a className="item-block" href={`/post/${post.post.postId}`}>
                <header>
                  <img src={post.post.Companies[0].img_url} alt="" />
                  <div className="hgroup">
                    <h4>{post.post.title}</h4>
                    <h5>{post.post.Companies[0].name}</h5>
                  </div>
                  <div className="header-meta">
                    <span className="location">{post.post.WorkPlaces}</span>
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
              </header>

              <div className="row item-blocks-condensed">{recentJobs}</div>

              <br />
              <br />
              <p className="text-center">
                <Link to="/advancedSearch" className="btn btn-primary">
                  Xem tất cả các công việc
                </Link>
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

          <section
            className="bg-img text-center"
            style={{
              backgroundImage: `url(${BGFact})`,
            }}
          >
            {/* <section className="bg-img text-center"> */}
            <div className="container">
              <h2>
                <strong>Đăng ký</strong>
              </h2>
              {/* <h6 className="font-alt">
                Get weekly top new jobs delivered to your inbox
              </h6> */}
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
          </section>
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
  getWishList: PropTypes.func.isRequired,
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
  getWishList,
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
