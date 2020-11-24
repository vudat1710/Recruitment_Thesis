import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Details1 from "../../assets/img/details1.jpg";
import Details2 from "../../assets/img/details2.jpg";
import Details3 from "../../assets/img/details3.jpg";
import {
  getWishList,
  addToWishList,
  removeFromWishList,
} from "../../actions/wishlist.action";
import {
  getPostById,
  ratePost,
  getRateByUserIdPostId,
} from "../../actions/post.action";
import { experienceDict } from "../../utils/utils";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "../common/Button";
import "./Rating.scss";
import Comment from "./Comment";
import BGImage from "../../assets/img/product-info.png";
// import TextInputAuth from "../HOC/TextInputAuth";
// import SwappingSquaresSpinner from "../common/SwappingSquaresSpinner";
import Rating from "@material-ui/lab/Rating";

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
    };
  }

  setValue(e) {
    this.setState({ valueRating: e.target.value });
  }

  async componentDidMount() {
    await this.props.getPostById(this.state.postId);
    if (this.props.auth.isAuthenticated) {
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
    }
    const userRate =
      this.props.posts.postDetails.RatePosts.length !== 0 && localStorage.userId
        ? this.props.posts.postDetails.RatePosts.filter(
            (a) => a.userId === parseInt(localStorage.userId)
          )[0].rate
        : 0;
    this.setState({
      ...this.state,
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
  }

  render() {
    const { postDetails, isLoading } = this.state;
    const { isAuthenticated } = this.props.auth;

    if (!isLoading) {
      return <></>;
    } else {
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
            Bạn cần <strong style={{ color: "red" }}>ĐĂNG NHẬP</strong> để thêm
            sản phẩm này vào danh sách yêu thích
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
            <Link to="/login" style={{ color: "red" }}>
              ĐĂNG NHẬP
            </Link>{" "}
            để đánh giá sản phẩm này
          </h6>
        </span>
      );

      let avgRate = postDetails.RatePosts.map((a) => parseInt(a.rate));
      avgRate = avgRate.reduce((a, b) => a + b, 0) / avgRate.length || 0;
      return (
        <>
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
                    <a href={`/company/${postDetails.Companies[0].companyId}`}>
                      {postDetails.Companies[0].name}
                    </a>
                  </h3>
                  <div>
                    <Rating name="read-only" value={avgRate} readOnly />
                    <span> ({avgRate})</span>
                  </div>
                </div>
                {/* <time datetime="2016-03-03 20:00"></time> */}
                <hr />
                {/* <p className="lead">{postDetails.Companies[0].description}</p> */}

                <ul className="details cols-12">
                  <li>
                    <i className="fa fa-map-marker"></i>
                    <span>{postDetails.address}</span>
                  </li>
                </ul>
                <ul className="details cols-3">
                  <li>
                    <i className="fa fa-briefcase"></i>
                    <span>{postDetails.job_type}</span>
                  </li>

                  <li>
                    <i className="fa fa-money"></i>
                    <span>{postDetails.salary_type} (VND) </span>
                  </li>

                  <li>
                    <i className="fa fa-clock-o"></i>
                    <span>{postDetails.valid_through}</span>
                  </li>

                  <li>
                    <i className="fa fa-flask"></i>
                    <span>{experienceDict[postDetails.experience]}</span>
                  </li>

                  <li>
                    <i className="fa fa-certificate"></i>
                    <a href="#">{postDetails.qualification}</a>
                  </li>
                </ul>

                <div className="button-group">
                  <ul className="social-icons">
                    <li className="title">Thêm vào danh sách ưa thích</li>
                    <li>{addToWishListButton}</li>
                    {/* <li>
                      <a className="facebook" href="#">
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a className="google-plus" href="#">
                        <i className="fa fa-google-plus"></i>
                      </a>
                    </li>
                    <li>
                      <a className="twitter" href="#">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a className="linkedin" href="#">
                        <i className="fa fa-linkedin"></i>
                      </a>
                    </li> */}
                  </ul>
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
                      {postDesc.map((item) => {
                        if (item.trim() !== "") return <li>{item}</li>;
                      })}
                    </ul>

                    <br />
                    <h4>Yêu cầu bổ sung</h4>
                    <ul>
                      {extraReqs.map((item) => {
                        if (item.trim() !== "") return <li>{item}</li>;
                      })}
                    </ul>

                    <br />
                    <h4>Quyền lợi được hưởng</h4>
                    <ul>
                      {jobBenefits.map((item) => {
                        if (item.trim() !== "") return <li>{item}</li>;
                      })}
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
                        <span>
                          {" "}
                          {postDetails.Majors.map((a) => a.name).join(", ")}
                        </span>
                      </li>
                    </ul>
                    <hr />
                    <ul className="details cols-12">
                      <li>
                        <label>Địa điểm làm việc:</label>
                        <span>
                          {" "}
                          {postDetails.WorkPlaces.map((a) => a.name).join(", ")}
                        </span>
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
            {/* } */}
          </main>
        </>
      );
    }
  }
}

PostDetails.propTypes = {
  posts: PropTypes.object.isRequired,
  getPostById: PropTypes.func.isRequired,
  wishlist: PropTypes.object.isRequired,
  ratePost: PropTypes.func.isRequired,
  addToWishList: PropTypes.func.isRequired,
  getWishList: PropTypes.func.isRequired,
  removeFromWishList: PropTypes.func.isRequired,
  getRateByUserIdPostId: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  wishlist: state.wishlist,
  auth: state.auth,
});

const mapDispatchToProps = {
  getPostById,
  ratePost,
  addToWishList,
  getWishList,
  removeFromWishList,
  getRateByUserIdPostId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PostDetails));
