import React, { Component } from "react";
import Button from "../common/Button";
import { Link, withRouter } from "react-router-dom";
import {
  postComment,
  deleteComment,
  getCommentByPostId,
} from "../../actions/post.action";
import { getUserByUserId } from "../../actions/user.action";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import UserLogo from "../../assets/img/logo.png";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      comments: null,
      value: "",
      gender: "",
      yearOfBirth: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    await this.props.getCommentByPostId(this.props.postId);
    await this.props.getUserByUserId(localStorage.userId);
    let temp = [];
    for (let i = 0; i < this.props.posts.comments.length; i++) {
      const x = this.props.posts.comments[i];
      temp.push({
        id: x.id,
        content: x.content,
        postId: x.postId,
        userId: x.userId,
        userName: x.User.user_name,
        gender: x.User.gender,
        yearOfBirth: x.User.year_of_birth,
      });
    }
    this.setState({
      ...this.state,
      comments: temp,
      gender: this.props.user.gender,
      yearOfBirth: this.props.user.year_of_birth,
    });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert("A name was submitted: " + this.state.value);
    event.preventDefault();
  }

  getTime() {
    var d = new Date();
    var day = d.getDate();
    var year = d.getFullYear();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var month = d.getMonth() + 1;
    var second = d.getSeconds();
    return (
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
    );
  }

  async post(content) {
    let details = {
      content: content,
      postId: this.props.postId,
      userId: localStorage.userId,
    };
    await this.props.postComment(details);
    await this.setState({
      comments: this.state.comments.concat({
        userId: localStorage.userId,
        postId: this.props.postId,
        content: this.state.value,
        gender: this.props.gender,
        yearOfBirth: this.state.yearOfBirth,
        userName: localStorage.userName,
      }),
    });
    await this.setState({ value: "" });
  }

  async onDeleteClick(id) {
    await this.props.deleteComment({ id: id });
    await this.setState({
      comments: this.state.comments.filter((comment) => comment.id !== id),
    });
  }

  render() {
    const { comments } = this.state;
    const { isAuthenticated } = this.props.auth;
    const Comment = isAuthenticated ? (
      <div className="col-xs-12">
        <div className="item-block">
          <div className="item-body">
            <label style={{ width: "30%" }}>
              <input
                style={{ width: "100%", height: "40px" }}
                type="longtext"
                value={this.state.value}
                onChange={this.handleChange}
              />
            </label>
            <Button
              style={{ height: 40, width: 120 }}
              type="submit"
              title="Post comment"
              onClick={() => {
                this.setState({
                  ...this.state,
                  isLoading: true,
                });
                setTimeout(() => {
                  this.setState({
                    ...this.state,
                    isLoading: false,
                  });
                }, 600);
                this.post(this.state.value);
              }}
              isLoading={this.state.isLoading}
            >
              Đăng bình luận
            </Button>
          </div>
        </div>
      </div>
    ) : (
      <h6>
        Bạn cần{" "}
        <Link to="/login" style={{ color: "red" }}>
          ĐĂNG NHẬP
        </Link>{" "}
        để bình luận về sản phẩm này
      </h6>
    );
    let listComments;
    if (comments) {
      if (comments.length !== 0) {
        listComments = comments.map((e) => (
          <div className="col-xs-12">
            <div className="item-block">
              <header>
                <img src={UserLogo} alt="" />
                <div className="hgroup">
                  <h4>{e.userName}</h4>
                  {/* <span style={{ marginRight: "20px" }}>
                    Giới tính: {e.gender}
                  </span>
                  <span>Ngày sinh: {e.yearOfBirth}</span> */}
                </div>
                <div className="item-body">
                  <h5>Đã bình luận: {e.content}</h5>
                </div>
              </header>
              {e.userName === localStorage.userName ? (
                <footer>
                  <p className="status">
                    <strong>Thao tác:</strong>
                  </p>
                  <div className="action-btn">
                    <a
                      className="btn btn-xs btn-danger"
                      onClick={() => this.onDeleteClick(e.id)}
                    >
                      Xóa
                    </a>
                  </div>
                </footer>
              ) : (
                <></>
              )}
            </div>
          </div>
        ));
      }
    } else {
      listComments = <></>;
    }
    if (comments === null) {
      return (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      );
    }

    return (
      <div>
        <div className="col">
          <h4>Bình luận:</h4>
        </div>
        <div className="col">{listComments}</div>
        <div className="col">{Comment}</div>
        <div style={{ height: 50 }}></div>
      </div>
    );
  }
}
Comment.propTypes = {
  posts: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  postComment: PropTypes.func.isRequired,
  getCommentByPostId: PropTypes.func.isRequired,
  getUserByUserId: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  user: state.user,
  auth: state.auth,
});

const mapDispatchToProps = {
  postComment,
  deleteComment,
  getCommentByPostId,
  getUserByUserId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Comment));
