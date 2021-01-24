import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import Details1 from "../../assets/img/details1.jpg";
import Details2 from "../../assets/img/details2.jpg";
import Details3 from "../../assets/img/details3.jpg";
import { getUserByUserId } from "../../actions/user.action";
import {
  getWishList,
  addToWishList,
  removeFromWishList,
} from "../../actions/wishlist.action";
import {
  getPostById,
  ratePost,
  getRateByUserIdPostId,
  addToCompare,
} from "../../actions/post.action";
import { getRelatedItems } from "../../actions/recommend.action";
import { getClickPostEvent } from "../../actions/user.action";
import {
  experienceDict,
  normalizeWorkPlaces,
  normalizeLongName,
} from "../../utils/utils";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./Rating.scss";
import Comment from "./Comment";
import SweetAlert from "react-bootstrap-sweetalert";
import Rating from "@material-ui/lab/Rating";
import TheJobs from "../../assets/img/logo2.png";

let BgBanner;
if (Math.floor(Math.random() * 3 + 1) === 1) {
  BgBanner = Details1;
} else if (Math.floor(Math.random() * 3 + 1) === 2) {
  BgBanner = Details2;
} else {
  BgBanner = Details3;
}

class PostDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.match.params.id,
      postDetails: {},
      isLoading: false,
      valueRating: 0,
      isAdded: false,
      isAddedCompare: "",
      relatedPosts: [],
    };
  }

  setValue(e) {
    this.setState({ valueRating: e.target.value });
  }

  async componentDidMount() {
    await this.props.getPostById(this.state.postId);
    if (this.props.auth.isAuthenticated) {
      await this.props.getClickPostEvent({
        postId: this.state.postId,
        userId: localStorage.userId,
        name: "CLICK_POST",
      });
      await this.props.getWishList({
        userId: localStorage.userId,
      });
      const isIn = this.props.wishlist.posts
        .map((e) => e.postId)
        .includes(parseInt(this.state.postId));
      if (isIn) {
        this.setState({
          ...this.state,
          isAdded: true,
        });
      }
      if (this.props.user == {}) {
        await this.props.getUserByUserId(localStorage.userId);
      }
      await this.props.getRelatedItems(this.props.posts.postDetails);
    }

    const userRate =
      this.props.posts.postDetails.RatePosts.length !== 0 && localStorage.userId
        ? this.props.posts.postDetails.RatePosts.filter(
            (a) => a.userId === parseInt(localStorage.userId)
          )[0].rate
        : 0;
    this.setState({
      ...this.state,
      relatedPosts: this.props.recommend.items,
      postDetails: this.props.posts.postDetails,
      isLoading: true,
      valueRating: userRate,
    });
  }

  async rating(e) {
    e.preventDefault();
    let details = {
      postId: this.state.postId,
      rate: parseInt(e.target.value),
      userId: localStorage.userId,
    };
    this.setState({
      ...this.state,
      valueRating: parseInt(e.target.value),
    });
    if (parseInt(e.target.value) > 3) {
      await this.props.getRelatedItems(this.props.posts.postDetails);
    }
    await this.props.ratePost(details);
  }

  async onAddToWishList(postId) {
    if (!this.state.isAdded) {
      await this.props.addToWishList({
        userId: localStorage.userId,
        postId: this.state.postId,
      });
    } else {
      await this.props.removeFromWishList({
        userId: localStorage.userId,
        postId: this.state.postId,
      });
    }
    this.setState({
      ...this.state,
      isAdded: !this.state.isAdded,
    });
    if (this.state.isAdded) {
      await this.props.getRelatedItems(this.props.posts.postDetails);
    }
  }

  async onCompareClick(action) {
    await this.props.addToCompare({
      postId: this.state.postId,
      type: action,
      compareList: this.props.posts.compareList,
    });

    if (action === "add") {
      this.setState({
        ...this.state,
        isAddedCompare: "added",
      });
    }

    if (action === "remove") {
      this.setState({
        ...this.state,
        isAddedCompare: "existed",
      });
    }
  }

  onCancelConfirm() {
    this.setState({
      ...this.state,
      isAddedCompare: "",
    });
  }

  render() {
    const { postDetails, isLoading, relatedPosts } = this.state;
    const { isAuthenticated } = this.props.auth;

    if (!isLoading) {
      return (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      );
    } else {
      let PostContent = isAuthenticated ? (
        this.state.isAdded || this.state.valueRating > 3 ? (
          <section>
            <div className="container">
              <header className="section-header">
                <span>Các việc làm tương tự</span>
                <h2>Công việc tương tự với công việc này</h2>
              </header>

              <div className="row item-blocks-condensed">
                {relatedPosts.map((post) => {
                  console.log(post);
                  return (
                    <div className="col-xs-12">
                      <a
                        className="item-block"
                        href={`/post/${post.post.postId}`}
                      >
                        <header>
                          {post.post.img || post.post.img !== "" ? (
                            <img src={post.post.img} alt="" />
                          ) : (
                            <img src={TheJobs} alt="" />
                          )}
                          <div className="hgroup">
                            <h4>{normalizeLongName(post.post.title)}</h4>
                            <h5>
                              {normalizeLongName(post.post.name)}{" "}
                              <span className="label label-success">
                                {post.post.job_type}
                              </span>
                            </h5>
                          </div>
                          <time datetime="2016-03-10 20:00">
                            Deadline: {post.post.valid_through}
                          </time>
                        </header>

                        <footer>
                          <ul className="details cols-3">
                            <li>
                              <i className="fa fa-map-marker"></i>
                              <span>
                                {normalizeWorkPlaces(
                                  post.post.WorkPlaces.split(",").map((a) =>
                                    a.trim()
                                  )
                                )}
                              </span>
                            </li>

                            <li>
                              <i className="fa fa-money"></i>
                              {this.props.auth.isAuthenticated ? (
                                <span>{post.post.salary_type}</span>
                              ) : (
                                <span>
                                  <h6>
                                    Bạn cần{" "}
                                    <Link
                                      to={{
                                        pathname: `/login`,
                                        postId: this.props.match.params.id,
                                      }}
                                      style={{ color: "red" }}
                                    >
                                      {/* <Link to="/login" style={{ color: "red" }}> */}
                                      ĐĂNG NHẬP
                                    </Link>{" "}
                                    để xem được mức lương
                                  </h6>
                                </span>
                              )}
                            </li>

                            {post.post.qualification ? (
                              <li>
                                <i className="fa fa-certificate"></i>
                                <span>{post.post.qualification}</span>
                              </li>
                            ) : (
                              <></>
                            )}
                          </ul>
                        </footer>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          <></>
        )
      ) : (
        <></>
      );

      let addToWishList =
        this.state.isAdded === false ? (
          <a
            className="wishlist"
            onClick={() => this.onAddToWishList(this.props.match.params.id)}
          >
            <i className="fa fa-plus"></i>
          </a>
        ) : (
          <a
            className="wishlist"
            onClick={() => this.onAddToWishList(this.props.match.params.id)}
          >
            <i className="fa fa-heart"></i>
          </a>
        );

      let addToWishListButton =
        isAuthenticated === false ? (
          <h6>
            Bạn cần{" "}
            <Link
              to={{ pathname: `/login`, postId: this.props.match.params.id }}
              style={{
                color: "red",
                all: "initial",
                fontFamily: "Helvetica Neue,Helvetica,Arial,sans-serif",
                fontSize: "14px",
              }}
            >
              ĐĂNG NHẬP
            </Link>{" "}
            để thêm sản phẩm này vào danh sách yêu thích
          </h6>
        ) : (
          addToWishList
        );
      let postDesc, jobBenefits, extraReqs;
      if (postDetails.description.includes("\n")) {
        postDesc = postDetails.description.split("\n");
      }
      if (postDetails.job_benefits.includes("\n")) {
        jobBenefits = postDetails.job_benefits.split("\n");
      }
      if (postDetails.extra_requirements.includes("\n")) {
        extraReqs = postDetails.extra_requirements.split("\n");
      }

      const ContactName = postDetails.contact_name ? (
        <ul className="details cols-12">
          <li>
            <label>Liên hệ:</label>
            <span> {postDetails.contact_name}</span>
          </li>
        </ul>
      ) : (
        <></>
      );

      const rate = isAuthenticated ? (
        <span>
          <Rating
            name="simple-controlled"
            size="large"
            value={this.state.valueRating}
            onChange={(e) => {
              this.setValue(e);
              this.rating(e);
            }}
          />
          <span> ({this.state.valueRating} / 5)</span>
        </span>
      ) : (
        <span>
          <h6>
            Bạn cần{" "}
            <Link
              to={{ pathname: `/login`, postId: this.props.match.params.id }}
              style={{ color: "red" }}
            >
              {/* <Link to="/login" style={{ color: "red" }}> */}
              ĐĂNG NHẬP
            </Link>{" "}
            để đánh giá sản phẩm này
          </h6>
        </span>
      );

      let avgRate = postDetails.RatePosts.map((a) => parseInt(a.rate));
      avgRate = avgRate.reduce((a, b) => a + b, 0) / avgRate.length || 0;

      let compareElement;

      if (this.props.posts.compareList.includes(this.state.postId)) {
        compareElement = (
          <button
            className="btn btn-block btn-primary"
            onClick={() => this.onCompareClick("remove")}
          >
            Loại khỏi so sánh
          </button>
        );
      } else {
        compareElement = (
          <button
            className="btn btn-block btn-primary"
            onClick={() => this.onCompareClick("add")}
          >
            Thêm vào so sánh
          </button>
        );
      }

      let alertS;
      if (this.state.isAddedCompare === "added") {
        alertS = (
          <SweetAlert
            success
            title="Bài viết đã được thêm vào so sánh!"
            onConfirm={() => {
              this.onCancelConfirm();
            }}
          ></SweetAlert>
        );
      } else if (this.state.isAddedCompare === "existed") {
        alertS = (
          <SweetAlert
            success
            title="Đã loại khỏi so sánh!"
            onConfirm={() => {
              this.onCancelConfirm();
            }}
          ></SweetAlert>
        );
      } else {
        alertS = <></>;
      }
      const majorsUser = isAuthenticated
        ? this.props.user.user.Majors.map((a) => a.name)
        : [];
      const workplacesUser = isAuthenticated
        ? this.props.user.user.WorkPlaces.map((a) => a.name)
        : [];

      const majors = postDetails.Majors.map((a) => a.name);
      const majorDup = majors.filter((a) => majorsUser.includes(a));
      const majorNotDup = majors.filter((a) => !majorsUser.includes(a));
      const workplaces = postDetails.WorkPlaces.map((a) => a.name);
      const workplaceDup = workplaces.filter((a) => workplacesUser.includes(a));
      const workplaceNotDup = workplaces.filter(
        (a) => !workplacesUser.includes(a)
      );

      return (
        <>
          {alertS}
          <header
            className="page-header bg-img size-lg"
            style={{
              backgroundImage: `url(${BgBanner})`,
            }}
          >
            <div className="container">
              <div className="header-detail">
                <img
                  className="logo"
                  src={postDetails.Companies[0].img_url}
                  alt=""
                />
                <div className="hgroup">
                  <h1>{postDetails.title}</h1>
                  <h3>
                    {postDetails.Companies[0].is_deleted !== 0 ? (
                      <a>{postDetails.Companies[0].name} (Đã xóa)</a>
                    ) : (
                      <a
                        href={`/company/${postDetails.Companies[0].companyId}`}
                      >
                        {postDetails.Companies[0].name}
                      </a>
                    )}
                  </h3>
                  <div>
                    <Rating name="read-only" value={avgRate} readOnly />
                    <span> ({avgRate})</span>
                  </div>
                </div>
                {/* <time datetime="2016-03-03 20:00"></time> */}
                <hr />

                <ul className="details cols-12">
                  <li>
                    <i className="fa fa-map-marker"></i>
                    <span>{postDetails.address}</span>
                  </li>
                </ul>
                <ul className="details cols-3">
                  <li>
                    <i className="fa fa-briefcase"></i>
                    {isAuthenticated ? (
                      postDetails.job_type === this.props.user.user.job_type ? (
                        <span>
                          <strong style={{ color: "black" }}>
                            {postDetails.job_type}
                          </strong>
                        </span>
                      ) : (
                        <span>{postDetails.job_type}</span>
                      )
                    ) : (
                      <span>{postDetails.job_type}</span>
                    )}
                  </li>

                  <li>
                    <i className="fa fa-money"></i>
                    {isAuthenticated ? (
                      postDetails.salary_type ===
                      this.props.user.user.salary_type ? (
                        <span>
                          <strong style={{ color: "black" }}>
                            {postDetails.salary_type}
                          </strong>{" "}
                          (VND)
                        </span>
                      ) : (
                        <span>{postDetails.salary_type} (VND)</span>
                      )
                    ) : (
                      <span>
                        Bạn cần{" "}
                        <Link
                          to={{
                            pathname: `/login`,
                            postId: this.props.match.params.id,
                          }}
                          style={{ color: "red" }}
                        >
                          {/* <Link to="/login" style={{ color: "red" }}> */}
                          ĐĂNG NHẬP
                        </Link>{" "}
                        để xem được mức lương
                      </span>
                    )}
                  </li>
                </ul>
                <ul className="details cols-3">
                  <li>
                    <i className="fa fa-clock-o"></i>
                    <span>{postDetails.valid_through}</span>
                  </li>

                  <li>
                    <i className="fa fa-flask"></i>
                    {isAuthenticated ? (
                      postDetails.experience ===
                      this.props.user.user.experience ? (
                        <span>
                          <strong style={{ color: "black" }}>
                            {experienceDict[postDetails.experience]}
                          </strong>
                        </span>
                      ) : (
                        <span>{experienceDict[postDetails.experience]}</span>
                      )
                    ) : (
                      <span>{experienceDict[postDetails.experience]}</span>
                    )}
                  </li>

                  <li>
                    <i className="fa fa-certificate"></i>
                    {isAuthenticated ? (
                      postDetails.qualification
                        .split(",")
                        .map((a) => a.trim())
                        .includes(this.props.user.user.qualification) ? (
                        <span>
                          <strong style={{ color: "black" }}>
                            {postDetails.qualification}
                          </strong>
                        </span>
                      ) : (
                        <span>{postDetails.qualification}</span>
                      )
                    ) : (
                      <span>{postDetails.qualification}</span>
                    )}
                  </li>
                </ul>

                <div className="button-group">
                  <ul className="social-icons">
                    <li className="title">Thêm vào danh sách ưa thích</li>
                    <li>{addToWishListButton}</li>
                  </ul>
                  <div className="action-buttons">
                    <div className="upload-button">
                      {isAuthenticated ? compareElement : <></>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main>
            <section>
              <div className="container">
                <p>{postDetails.Companies[0].description}</p>

                <br />
                <div className="row">
                  <div
                    className="col-lg-9 col-md-12 col-sm-12"
                    style={{ borderRight: "1px solid grey" }}
                  >
                    <h4>Mô tả công việc</h4>
                    <ul>
                      {postDesc
                        ? postDesc.map((item) => {
                            if (item.trim() !== "") return <p>{item}</p>;
                          })
                        : postDetails.description}
                    </ul>

                    <br />
                    <h4>Yêu cầu bổ sung</h4>
                    <ul>
                      {extraReqs
                        ? extraReqs.map((item) => {
                            if (item.trim() !== "") return <p>{item}</p>;
                          })
                        : postDetails.extra_requirements}
                    </ul>

                    <br />
                    <h4>Quyền lợi được hưởng</h4>
                    <ul>
                      {jobBenefits
                        ? jobBenefits.map((item) => {
                            if (item.trim() !== "") return <p>{item}</p>;
                          })
                        : postDetails.job_benefits}
                    </ul>
                  </div>
                  <div className="col-lg-3 col-md-12 col-sm-12">
                    <div className="hgroup">
                      <h4>Yêu cầu tóm tắt</h4>
                    </div>
                    <hr />
                    <ul className="details cols-12">
                      <li>
                        <label>Ngành nghề:</label>
                        {isAuthenticated ? (
                          <span>
                            {" "}
                            <strong style={{ color: "black" }}>
                              {majorDup.join(", ")}
                            </strong>
                            {majorDup.length !== 0 ? ", " : ""}
                            {majorNotDup.join(", ")}
                          </span>
                        ) : (
                          <span> {majors.join(", ")}</span>
                        )}
                      </li>
                    </ul>
                    <hr />
                    <ul className="details cols-12">
                      <li>
                        <label>Địa điểm làm việc:</label>
                        {isAuthenticated ? (
                          <span>
                            {" "}
                            <strong style={{ color: "black" }}>
                              {workplaceDup.join(", ")}
                            </strong>
                            {workplaceDup.length !== 0 ? ", " : ""}
                            {workplaceNotDup.join(", ")}
                          </span>
                        ) : (
                          <span> {workplaces.join(", ")}</span>
                        )}
                      </li>
                    </ul>
                    <hr />
                    {ContactName}
                  </div>
                </div>
                <br />
                <div className="row">
                  <span className="rate">Đánh giá:{"\t"}</span>
                  {rate}
                </div>
                <div className="row" style={{ borderTop: "1px solid grey" }}>
                  <br />
                  <Comment postId={this.state.postId} />
                </div>
              </div>
            </section>

            {PostContent}
            {/* } */}
          </main>
        </>
      );
    }
  }
}

PostDetails.propTypes = {
  posts: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  recommend: PropTypes.object.isRequired,
  getPostById: PropTypes.func.isRequired,
  wishlist: PropTypes.object.isRequired,
  ratePost: PropTypes.func.isRequired,
  addToWishList: PropTypes.func.isRequired,
  getWishList: PropTypes.func.isRequired,
  removeFromWishList: PropTypes.func.isRequired,
  getRateByUserIdPostId: PropTypes.func.isRequired,
  getPostById: PropTypes.func.isRequired,
  getRelatedItems: PropTypes.func.isRequired,
  addToCompare: PropTypes.func.isRequired,
  getUserByUserId: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  wishlist: state.wishlist,
  recommend: state.recommend,
  auth: state.auth,
  user: state.user,
});

const mapDispatchToProps = {
  getPostById,
  ratePost,
  addToWishList,
  getWishList,
  removeFromWishList,
  getRateByUserIdPostId,
  getClickPostEvent,
  getRelatedItems,
  addToCompare,
  getUserByUserId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PostDetails));
