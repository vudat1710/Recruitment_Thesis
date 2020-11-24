import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import Details1 from "../../assets/img/details1.jpg";
import Details2 from "../../assets/img/details2.jpg";
import Details3 from "../../assets/img/details3.jpg";
import { compare, getPostById } from "../../actions/post.action";
import { experienceDict } from "../../utils/utils";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import PropTypes from "prop-types";

let BgBanner;
if (Math.floor(Math.random() * 3 + 1) === 1) {
  BgBanner = Details1;
} else if (Math.floor(Math.random() * 3 + 1) === 2) {
  BgBanner = Details2;
} else {
  BgBanner = Details3;
}

class Compare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      compareList: [],
      compareResult: {},
      cancelConfirm: false,
      posts: [],
    };
  }

  async componentDidMount() {
    const a = JSON.parse(localStorage.getItem("compareList")) || [];
    let posts = [];
    await this.props.compare({ compareList: a, userId: localStorage.userId });
    for (let i = 0; i < a.length; i++) {
      await this.props.getPostById(a[i]);
      posts.push(this.props.posts.postDetails);
    }

    this.setState({
      ...this.state,
      compareList: a,
      compareResult: this.props.posts.compare,
      isLoading: false,
      posts: posts,
    });
  }

  onCancelConfirm() {
    this.setState({
      ...this.state,
      cancelConfirm: true,
    });
  }

  onDeleteClick() {
    localStorage.removeItem("compareList");
    this.setState({
      ...this.state,
      cancelConfirm: true,
    });
  }

  renderRedirect = () => {
    if (this.state.cancelConfirm) {
      return <Redirect to={{ pathname: "/" }} />;
    }
  };

  render() {
    let { compareList, isLoading, compareResult, posts } = this.state;

    if (isLoading) {
      return (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      );
    } else {
      if (compareList.length < 2) {
        return (
          <>
            {this.renderRedirect()}
            <SweetAlert
              warning
              title="Bạn cần thêm bài viết nữa để so sánh!"
              onConfirm={() => {
                this.onCancelConfirm();
              }}
            ></SweetAlert>
          </>
        );
      } else {
        const compareListInt = compareList.map((x) => parseInt(x));
        let sal1, sal2;
        console.log(posts)
        if (
          posts.find((x) => x.postId === compareListInt[0]).salary_type ===
            "Thoả thuận" ||
          posts.find((x) => x.postId === compareListInt[1]).salary_type ===
            "Thoả thuận"
        ) {
          sal1 = (
            <input
              type="text"
              className="form-control"
              placeholder="Salary min"
              value={
                posts.find((x) => x.postId === compareListInt[0]).salary_type
              }
              readOnly
              style={{
                backgroundColor: compareResult[compareList[0]].salary.deal
                  ? "aqua"
                  : "white",
              }}
            />
          );
          sal2 = (
            <input
              type="text"
              className="form-control"
              placeholder="Salary min"
              value={
                posts.find((x) => x.postId === compareListInt[1]).salary_type
              }
              readOnly
              style={{
                backgroundColor: compareResult[compareList[1]].salary.deal
                  ? "aqua"
                  : "white",
              }}
            />
          );
        } else if (
          (posts.find((x) => x.postId === compareListInt[0]).min_value ===
            posts.find((x) => x.postId === compareListInt[0]).max_value) &&
          (posts.find((x) => x.postId === compareListInt[1]).min_value ===
            posts.find((x) => x.postId === compareListInt[1]).max_value)
        ) {
            console.log("akhdjkshakjdh")
          sal1 = (
            <input
              type="text"
              className="form-control"
              placeholder="Salary min"
              value={
                posts.find((x) => x.postId === compareListInt[0]).salary_type
              }
              readOnly
              style={{
                backgroundColor: compareResult[compareList[0]].salary.min
                  ? "aqua"
                  : "white",
              }}
            />
          );
          sal2 = (
            <input
              type="text"
              className="form-control"
              placeholder="Salary min"
              value={
                posts.find((x) => x.postId === compareListInt[1]).salary_type
              }
              readOnly
              style={{
                backgroundColor: compareResult[compareList[1]].salary.min
                  ? "aqua"
                  : "white",
              }}
            />
          );
        }
        return (
          <>
            {this.renderRedirect()}
            <header
              className="page-header bg-img size-lg"
              style={{
                backgroundImage: `url(${BgBanner})`,
              }}
            >
              <div className="container no-shadow">
                <h1 className="text-center">So sánh việc làm</h1>
                <p className="lead">
                  Dưới đây là so sánh mà hệ thống đưa ra về 2 việc làm mà bạn đã
                  chọn. Bạn có thể loại bỏ các bài viết đã chọn và tiến hành lựa
                  chọn lại các bài viết khác.
                </p>
                <div className="button-group">
                  <div className="action-buttons">
                    <div className="upload-button">
                      <button
                        className="btn btn-block btn-primary"
                        onClick={() => this.onDeleteClick()}
                      >
                        Xóa so sánh
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <main>
              <section className="demo-btn-margin">
                <div className="container">
                  <label>Tên công việc: </label>
                  <div className="row">
                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <h4>
                          {
                            posts.find((x) => x.postId === compareListInt[0])
                              .title
                          }
                        </h4>
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <h4>
                          {
                            posts.find((x) => x.postId === compareListInt[1])
                              .title
                          }
                        </h4>
                      </div>
                    </div>
                  </div>

                  <label>Giới tính: </label>
                  <div className="row">
                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-certificate"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Gender"
                          value={
                            posts.find((x) => x.postId === compareListInt[0])
                              .gender
                          }
                          readOnly
                          style={{
                            backgroundColor: compareResult[compareList[0]]
                              .gender
                              ? "aqua"
                              : "white",
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-certificate"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Gender"
                          value={
                            posts.find((x) => x.postId === compareListInt[1])
                              .gender
                          }
                          readOnly
                          style={{
                            backgroundColor: compareResult[compareList[1]]
                              .gender
                              ? "aqua"
                              : "white",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <label>Kinh nghiệm: </label>
                  <div className="row">
                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-flask"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Experience"
                          value={
                            experienceDict[
                              posts.find((x) => x.postId === compareListInt[0])
                                .experience
                            ]
                          }
                          readOnly
                          style={{
                            backgroundColor: compareResult[compareList[0]]
                              .experience
                              ? "aqua"
                              : "white",
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-flask"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Experience"
                          value={
                            experienceDict[
                              posts.find((x) => x.postId === compareListInt[1])
                                .experience
                            ]
                          }
                          readOnly
                          style={{
                            backgroundColor: compareResult[compareList[1]]
                              .experience
                              ? "aqua"
                              : "white",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <label>Bằng cấp: </label>
                  <div className="row">
                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-briefcase"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Qualification"
                          value={
                            posts.find((x) => x.postId === compareListInt[0])
                              .qualification
                          }
                          readOnly
                          style={{
                            backgroundColor: compareResult[compareList[0]]
                              .qualification
                              ? "aqua"
                              : "white",
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-briefcase"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Qualification"
                          value={
                            posts.find((x) => x.postId === compareListInt[1])
                              .qualification
                          }
                          readOnly
                          style={{
                            backgroundColor: compareResult[compareList[1]]
                              .qualification
                              ? "aqua"
                              : "white",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {sal1 ? (
                    <>
                      <label>Lương: </label>
                      <div className="row">
                        <div className="form-group col-xs-12 col-sm-6">
                          <div className="input-group input-group-sm">
                            <span className="input-group-addon">
                              <i className="fa fa-money"></i>
                            </span>
                            {sal1}
                          </div>
                        </div>

                        <div className="form-group col-xs-12 col-sm-6">
                          <div className="input-group input-group-sm">
                            <span className="input-group-addon">
                              <i className="fa fa-money"></i>
                            </span>
                            {sal2}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <label>Lương (min): </label>
                      <div className="row">
                        <div className="form-group col-xs-12 col-sm-6">
                          <div className="input-group input-group-sm">
                            <span className="input-group-addon">
                              <i className="fa fa-money"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Salary min"
                              value={
                                posts.find(
                                  (x) => x.postId === compareListInt[0]
                                ).min_value
                              }
                              readOnly
                              style={{
                                backgroundColor: compareResult[compareList[0]]
                                  .salary.min
                                  ? "aqua"
                                  : "white",
                              }}
                            />
                          </div>
                        </div>

                        <div className="form-group col-xs-12 col-sm-6">
                          <div className="input-group input-group-sm">
                            <span className="input-group-addon">
                              <i className="fa fa-money"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Salary min"
                              value={
                                posts.find(
                                  (x) => x.postId === compareListInt[1]
                                ).min_value
                              }
                              readOnly
                              style={{
                                backgroundColor: compareResult[compareList[1]]
                                  .salary.min
                                  ? "aqua"
                                  : "white",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <label>Lương (max): </label>
                      <div className="row">
                        <div className="form-group col-xs-12 col-sm-6">
                          <div className="input-group input-group-sm">
                            <span className="input-group-addon">
                              <i className="fa fa-money"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Salary max"
                              value={
                                posts.find(
                                  (x) => x.postId === compareListInt[0]
                                ).max_value
                              }
                              readOnly
                              style={{
                                backgroundColor: compareResult[compareList[0]]
                                  .salary.max
                                  ? "aqua"
                                  : "white",
                              }}
                            />
                          </div>
                        </div>

                        <div className="form-group col-xs-12 col-sm-6">
                          <div className="input-group input-group-sm">
                            <span className="input-group-addon">
                              <i className="fa fa-money"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Salary max"
                              value={
                                posts.find(
                                  (x) => x.postId === compareListInt[1]
                                ).max_value
                              }
                              readOnly
                              style={{
                                backgroundColor: compareResult[compareList[1]]
                                  .salary.max
                                  ? "aqua"
                                  : "white",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <label>Địa điểm làm việc: </label>
                  <div className="row">
                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-map-marker"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Workplaces"
                          value={posts
                            .find((x) => x.postId === compareListInt[0])
                            .WorkPlaces.map((x) => x.name)
                            .join(", ")}
                          readOnly
                          style={{
                            backgroundColor:
                              compareResult[compareList[0]].workplace.filter(
                                (value) =>
                                  posts
                                    .find((x) => x.postId === compareListInt[0])
                                    .WorkPlaces.map((x) => x.name)
                                    .includes(value)
                              ).length !== 0
                                ? "aqua"
                                : "white",
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-map-marker"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Workplaces"
                          value={posts
                            .find((x) => x.postId === compareListInt[1])
                            .WorkPlaces.map((x) => x.name)
                            .join(", ")}
                          readOnly
                          style={{
                            backgroundColor:
                              compareResult[compareList[1]].workplace.filter(
                                (value) =>
                                  posts
                                    .find((x) => x.postId === compareListInt[1])
                                    .WorkPlaces.map((x) => x.name)
                                    .includes(value)
                              ).length !== 0
                                ? "aqua"
                                : "white",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <label>Ngành nghề: </label>
                  <div className="row">
                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-laptop"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Majors"
                          value={posts
                            .find((x) => x.postId === compareListInt[0])
                            .Majors.map((x) => x.name)
                            .join(", ")}
                          readOnly
                          style={{
                            backgroundColor:
                              compareResult[compareList[0]].major.filter(
                                (value) =>
                                  posts
                                    .find((x) => x.postId === compareListInt[0])
                                    .Majors.map((x) => x.name)
                                    .includes(value)
                              ).length !== 0
                                ? "aqua"
                                : "white",
                          }}
                        />
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-laptop"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Majors"
                          value={posts
                            .find((x) => x.postId === compareListInt[1])
                            .Majors.map((x) => x.name)
                            .join(", ")}
                          readOnly
                          style={{
                            backgroundColor:
                              compareResult[compareList[1]].major.filter(
                                (value) =>
                                  posts
                                    .find((x) => x.postId === compareListInt[1])
                                    .Majors.map((x) => x.name)
                                    .includes(value)
                              ).length !== 0
                                ? "aqua"
                                : "white",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </>
        );
      }
    }
  }
}

Compare.propTypes = {
  posts: PropTypes.object.isRequired,
  compare: PropTypes.func.isRequired,
  getPostById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
});

const mapDispatchToProps = {
  compare,
  getPostById,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Compare));
