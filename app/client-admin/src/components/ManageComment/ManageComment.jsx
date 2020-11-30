import React, { Component } from "react";
import { getSearchData } from "../../utils/utils";
import { connect } from "react-redux";
import Banner from "../../assets/img/banner_details.jpg";
import { searchComments, deleteComment } from "../../actions/post.action";
import PropTypes from "prop-types";
import AutoCompleteText from "../HOC/AutoCompleteText";
import Pagination from "../Pagination/Pagination";

class ManageComment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      content: "",
      loading: false,
      resultComments: {},
      page: 1,
      comments: [],
    };
  }

  async componentDidMount() {
    this.setState({
      ...this.state,
      content: this.props.comments.searchParams.content,
      loading: true,
    });
  }

  onChange(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  }

  getSearchDataAd() {
    let searchData = {
      content: this.state.content,
    };

    searchData.size = 20;

    return searchData;
  }

  getChildState = (data) => {
    if (data.name === "content") {
      this.setState({
        ...this.state,
        content: data.text,
      });
    }
  };


  getChildStatePagination = (data) => {
    this.setState({
      ...this.state,
      resultComments: data.resultPosts,
      comments: data.resultPosts.comments,
    });
  };

  async onDeleteClick(id) {
    await this.props.deleteComment({ id: id });
    this.setState({
      ...this.state,
      comments: this.state.comments.filter((a) => a.id !== id),
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    let searchData = this.getSearchDataAd();
    searchData.page = 1;

    await this.props.searchComments(searchData);
    this.setState({
      ...this.state,
      resultComments: this.props.comments.searchResults,
      comments: this.props.comments.searchResults.comments,
    });
  }

  render() {
    const {
      loading,
      resultComments,
    } = this.state;

    let searchData = this.getSearchDataAd();
    let CommentComp = this.state.comments ? (
      this.state.comments.map((comment) => {
        return (
          <div className="col-xs-12">
            <a className="item-block">
              <header>
                <div className="hgroup">
                  <h4>
                    <a>{comment.content}</a>
                  </h4>
                </div>
              </header>

              <footer>
                <ul className="details cols-3">
                  <li>
                    <label>Đăng bởi:  </label>
                    <span>{comment.User.user_name}</span>
                  </li>

                  <li>
                  <label>Đăng trên:  </label>
                    <span>{comment.Post.title}</span>
                  </li>
                  <div class="action-btn">
                    <a
                      class="btn btn-xs btn-danger"
                      onClick={() => this.onDeleteClick(comment.id)}
                    >
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
      resultComments.totalItems && resultComments.totalItems > 0 ? (
        <Pagination
          totalPages={resultComments.totalPages}
          currentPage={resultComments.currentPage}
          searchData={searchData}
          getChildState={this.getChildStatePagination}
          type="comment"
        />
      ) : (
        <></>
      );

    let extraComp = resultComments.currentPage ? (
      <h5>
        Hệ thống đã tìm thấy <strong>{resultComments.totalItems}</strong> kết
        quả, bạn đang xem trang thứ <i>{resultComments.currentPage}</i> trong
        tổng số <i>{resultComments.totalPages} trang</i>
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
              <form action="#" onSubmit={(e) => this.onSubmit(e)}>
                <div className="row">
                <div className="form-group col-xs-12 col-sm-2">
                    <label>Nội dung: </label>
                  </div>
                  <div className="form-group col-xs-12 col-sm-10">
                    <AutoCompleteText
                      name="content"
                      items={[]}
                      value={this.state.content}
                      getChildState={this.getChildState}
                      placeholder="Nội dung"
                    />
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

                  {CommentComp}
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

ManageComment.propTypes = {
  comments: PropTypes.object.isRequired,
  searchComments: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ comments: state.comments });

const mapDispatchToProps = {
  searchComments,
  deleteComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageComment);
