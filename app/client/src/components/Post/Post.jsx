import React, { Component } from "react";
// import TextInputAuth from "../../HOC/TextInputAuth";
import { Link, withRouter } from "react-router-dom";
// import {
//   getBookById,
//   addToWishList,
//   getWishList,
// } from "../../actions/book.action";
// import { getCommentByIdBook } from "../../actions/comment.action";
// import { postComment } from "../../actions/comment.action";
import { experienceDict } from "../../utils/utils";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Banner from "../../assets/img/bg-banner2.jpg";
// import SwappingSquaresSpinner from "../common/SwappingSquaresSpinner";
// import Button from "../common/Button";
// import Rating from "@material-ui/lab/Rating";
import { getPostById } from "../../actions/post.action";
// import Comment from "../Product/Comment";
class PostDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postId: this.props.match.params.id,
      postDetails: {},
      isLoading: false,
      value_rating: 0,
      isAdded: false,
    };
  }

  setValue(value) {
    this.setState({ value_rating: value });
  }

  //   async componentWillMount() {
  //     await this.props.getPostById(this.state.postId);
  //     this.setState({
  //       ...this.state,
  //       postDetails: this.props.posts.postDetails,
  //     });
  //   }

  async componentDidMount() {
    await this.props.getPostById(this.state.postId);
    // await this.props.getWishList(localStorage.userId);
    // await this.props.getRatingBookUser(this.state.bookId, localStorage.userId);
    // this.setValue(this.props.ratings.rating_user);
    this.setState({
      ...this.state,
      postDetails: this.props.posts.postDetails,
      isLoading: true,
    });
  }

  //   rating(bookId, value) {
  //     let details = {
  //       bookId: bookId,
  //       rate: parseInt(value),
  //     };
  //     this.props.ratingBook(details);
  //   }

  render() {
    const { postDetails, isLoading } = this.state;
    console.log(postDetails);

    // const { rating, rating_user } = this.props.ratings;
    // const { isAuthenticated } = this.props.auth;
    // const rate = isAuthenticated ? (
    //   <Rating
    //     name="simple-controlled"
    //     value={this.state.value_rating}
    //     onChange={(event, newValue) => {
    //       this.setValue(newValue);
    //       this.rating(this.state.bookId, newValue);
    //     }}
    //   />
    // ) : (
    //   <h6>
    //     Bạn cần{" "}
    //     <Link to="/login" style={{ color: "red" }}>
    //       ĐĂNG NHẬP
    //     </Link>{" "}
    //     để đánh giá sản phẩm này
    //   </h6>
    // );
    // let enable =
    //   book === null ? (
    //     <></>
    //   ) : (
    //     book.enable
    //     // false
    //     // true
    //   );
    // let Content = loading || book === null ? <></> : book;
    // let addToWishList =
    //   this.state.isAdded === false ? (
    //     <a
    //       className="wishlist"
    //       onClick={() =>
    //         this.onAddToWishList(
    //           this.props.match.params.id,
    //           localStorage.userId
    //         )
    //       }
    //     ></a>
    //   ) : (
    //     <a
    //       className="wishlist"
    //       onClick={() =>
    //         this.onAddToWishList(
    //           this.props.match.params.id,
    //           localStorage.userId
    //         )
    //       }
    //       style={{ backgroundColor: "#f8cb00" }}
    //     ></a>
    //   );

    // let addToWishListButton =
    //   this.props.auth.isAuthenticated === false ? <></> : addToWishList;

    if (!isLoading) {
      return <></>;
    } else {
      let postDesc;
      if (postDetails.description.includes("\n")) {
        postDesc = postDetails.description.split("\n");
      }
      return (
        <>
          <header
            className="page-header bg-img size-lg"
            style={{
              backgroundImage: `url(${Banner})`,
            }}
          >
            <div className="container">
              <div className="header-detail">
                <img className="logo" src="assets/img/logo-google.jpg" alt="" />
                <div className="hgroup">
                  <h1>{postDetails.title}</h1>
                  <h3>
                    <a href="#">{postDetails.Companies[0].name}</a>
                  </h3>
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
                    <li className="title">Share on</li>
                    <li>
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
                    </li>
                  </ul>

                  <div className="action-buttons">
                    <a className="btn btn-primary" href="#">
                      Apply with linkedin
                    </a>
                    <a className="btn btn-success" href="job-apply.html">
                      Apply now
                    </a>
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
                <h4>Mô tả công việc</h4>
                {/* <p>
              {postDetails.description}
              </p> */}
                <ul>
                  {postDesc.map((item) => {
                    return <li>{item}</li>;
                  })}
                </ul>

                <br />
                <h4>Yêu cầu bổ sung</h4>
                <ul>
                  <li>
                    BA/BS degree in a technical field or equivalent practical
                    experience.{" "}
                  </li>
                  <li>
                    2 years of relevant work experience in software development.
                  </li>
                  <li>Programming experience in C, C++ or Java.</li>
                  <li>Experience with AJAX, HTML and CSS.</li>
                </ul>

                <br />
                <h4>Preferred qualifications</h4>
                <ul>
                  <li>Interest in user interface design.</li>
                  <li>Web application development experience.</li>
                  <li>Experience working on cross-browser platforms.</li>
                  <li>
                    Development experience designing object-oriented JavaScript.
                  </li>
                  <li>
                    Experience with user interface frameworks such as XUL, Flex
                    and XAML.
                  </li>
                  <li>Knowledge of user interface design.</li>
                </ul>
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
  //   addToCart: PropTypes.func.isRequired,
  //   cart: PropTypes.object.isRequired,
  //   comments: PropTypes.object.isRequired,
  //   getCommentByIdBook: PropTypes.func.isRequired,
  //   postComment: PropTypes.func.isRequired,
  //   ratingBook: PropTypes.func.isRequired,
  //   addToWishList: PropTypes.func.isRequired,
  //   getWishList: PropTypes.func.isRequired,
  //   getRatingBook: PropTypes.func.isRequired,
  //   getRatingBookUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  //   cart: state.cart,
  //   comments: state.comments,
  //   ratings: state.ratings,
  //   auth: state.auth,
});

const mapDispatchToProps = {
  getPostById,
  //   addToCart,
  //   getCommentByIdBook,
  //   postComment,
  //   ratingBook,
  //   addToWishList,
  //   getWishList,
  //   getRatingBook,
  //   getRatingBookUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PostDetails));
