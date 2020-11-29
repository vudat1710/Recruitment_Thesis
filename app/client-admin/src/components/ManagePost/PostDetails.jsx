import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import Details1 from "../../assets/img/details1.jpg";
import Details2 from "../../assets/img/details2.jpg";
import Details3 from "../../assets/img/details3.jpg";
import { getPostById, deletePost } from "../../actions/post.action";
import { experienceDict } from "../../utils/utils";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./Rating.scss";
import SweetAlert from "react-bootstrap-sweetalert";
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
      redirect: false,
      cancelConfirm: false,
    };
  }

  async componentDidMount() {
    await this.props.getPostById(this.state.postId);

    this.setState({
      ...this.state,
      postDetails: this.props.posts.postDetails,
      isLoading: true,
    });
  }

  async onDeleteClick(postId) {
    await this.props.deletePost({ postId: postId });
    this.setState({
      ...this.state,
      redirect: true,
    });
  }

  onCancelConfirm() {
    this.setState({
      ...this.state,
      cancelConfirm: true,
    });
  }

  renderRedirect = () => {
    if (this.state.cancelConfirm) {
      return <Redirect to={{ pathname: "/managePost" }} />;
    }
  };

  render() {
    const { postDetails, isLoading } = this.state;

    if (!isLoading) {
      return (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      );
    } else {
      let alert = this.state.redirect ? (
        <>
          {this.renderRedirect()}
          <SweetAlert
            success
            title="Xóa bài đăng thành công!"
            onConfirm={() => {
              this.onCancelConfirm();
            }}
          ></SweetAlert>
        </>
      ) : (
        <></>
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

      let avgRate = postDetails.RatePosts.map((a) => parseInt(a.rate));
      avgRate = avgRate.reduce((a, b) => a + b, 0) / avgRate.length || 0;

      return (
        <>
          {alert}
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
                  <div className="action-buttons">
                    <div className="upload-button">
                      <a
                        className="btn btn-xs btn-gray"
                        href={`/editPost/${postDetails.postId}`}
                      >
                        Edit
                      </a>
                      <a
                        className="btn btn-xs btn-danger"
                        onClick={() => this.onDeleteClick(postDetails.postId)}
                      >
                        Delete
                      </a>
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
                            if (item.trim() !== "") return <li>{item}</li>;
                          })
                        : postDetails.description}
                    </ul>

                    <br />
                    <h4>Yêu cầu bổ sung</h4>
                    <ul>
                      {extraReqs
                        ? extraReqs.map((item) => {
                            if (item.trim() !== "") return <li>{item}</li>;
                          })
                        : postDetails.extra_requirements}
                    </ul>

                    <br />
                    <h4>Quyền lợi được hưởng</h4>
                    <ul>
                      {jobBenefits
                        ? jobBenefits.map((item) => {
                            if (item.trim() !== "") return <li>{item}</li>;
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
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
});

const mapDispatchToProps = {
  getPostById,
  deletePost,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PostDetails));
