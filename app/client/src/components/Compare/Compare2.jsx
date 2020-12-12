import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import Details1 from "../../assets/img/details1.jpg";
import Details2 from "../../assets/img/details2.jpg";
import Details3 from "../../assets/img/details3.jpg";
import { addToCompare, getPostById } from "../../actions/post.action";
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
      cancelConfirm: false,
      posts: [],
    };
  }

  async componentDidMount() {
    const a = this.props.posts.compareList;
    let posts = [];

    for (let i = 0; i < a.length; i++) {
      await this.props.getPostById(a[i]);
      posts.push(this.props.posts.postDetails);
    }

    this.setState({
      ...this.state,
      compareList: a,
      isLoading: false,
      posts: posts,
    });
  }

  onCancelConfirm() {
    this.setState({
      ...this.state,
      cancelConfirm: false,
    });
  }

  onDeleteClick() {
    this.props.addToCompare({});
    this.setState({
      ...this.state,
      cancelConfirm: true,
    });
  }

  render() {
    let { compareList, isLoading, posts } = this.state;

    if (isLoading) {
      return (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      );
    } else {
      let alertS = this.state.cancelConfirm ? (
        <SweetAlert
          success
          title="Đã xóa khỏi so sánh!"
          onConfirm={() => {
            this.onCancelConfirm();
          }}
        ></SweetAlert>
      ) : (
        <></>
      );
      const compareListInt = compareList.map((x) => parseInt(x));
      const sal =
        posts.find((x) => x.postId === compareListInt[0]).salary_type !==
        posts.find((x) => x.postId === compareListInt[1]).salary_type;
      const gender =
        posts.find((x) => x.postId === compareListInt[0]).gender !==
        posts.find((x) => x.postId === compareListInt[1]).gender;
      const qualification =
        posts.find((x) => x.postId === compareListInt[0]).qualification !==
        posts.find((x) => x.postId === compareListInt[1]).qualification;
      const experience =
        posts.find((x) => x.postId === compareListInt[0]).experience !==
        posts.find((x) => x.postId === compareListInt[1]).experience;
      const major =
        posts
          .find((x) => x.postId === compareListInt[0])
          .Majors.map((x) => x.name)
          .join(", ") !==
        posts
          .find((x) => x.postId === compareListInt[1])
          .Majors.map((x) => x.name)
          .join(", ");
      const workplace =
        posts
          .find((x) => x.postId === compareListInt[0])
          .WorkPlaces.map((x) => x.name)
          .join(", ") !==
        posts
          .find((x) => x.postId === compareListInt[1])
          .WorkPlaces.map((x) => x.name)
          .join(", ");

      return (
        <>
          {alertS}
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
                          backgroundColor: gender ? "aqua" : "white",
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
                          backgroundColor: gender ? "aqua" : "white",
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
                          backgroundColor: experience ? "aqua" : "white",
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
                          backgroundColor: experience ? "aqua" : "white",
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
                          backgroundColor: qualification ? "aqua" : "white",
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
                          backgroundColor: qualification ? "aqua" : "white",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <label>Lương: </label>
                <div className="row">
                  <div className="form-group col-xs-12 col-sm-6">
                    <div className="input-group input-group-sm">
                      <span className="input-group-addon">
                        <i className="fa fa-money"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Salary"
                        value={
                          posts.find((x) => x.postId === compareListInt[0])
                            .salary_type
                        }
                        readOnly
                        style={{
                          backgroundColor: sal ? "aqua" : "white",
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
                        placeholder="Salary"
                        value={
                          posts.find((x) => x.postId === compareListInt[1])
                            .salary_type
                        }
                        readOnly
                        style={{
                          backgroundColor: sal ? "aqua" : "white",
                        }}
                      />
                    </div>
                  </div>
                </div>

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
                          backgroundColor: workplace ? "aqua" : "white",
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
                          backgroundColor: workplace ? "aqua" : "white",
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
                          backgroundColor: major ? "aqua" : "white",
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
                          backgroundColor: major ? "aqua" : "white",
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

Compare.propTypes = {
  posts: PropTypes.object.isRequired,
  addToCompare: PropTypes.func.isRequired,
  getPostById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
});

const mapDispatchToProps = {
  addToCompare,
  getPostById,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Compare));
