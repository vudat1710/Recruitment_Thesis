import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getWishList, removeFromWishList, searchPostsByTitle } from "../../actions/wishlist.action";
import PropTypes from "prop-types";
import Details1 from "../../assets/img/details1.jpg";
import Details2 from "../../assets/img/details2.jpg";
import Details3 from "../../assets/img/details3.jpg";
import { normalizeLongName } from "../../utils/utils";
import Pagination from "../Pagination/Pagination";
import TheJobs from "../../assets/img/logo2.png";

let BgBanner;
if (Math.floor(Math.random() * 3 + 1) === 1) {
  BgBanner = Details1;
} else if (Math.floor(Math.random() * 3 + 1) === 2) {
  BgBanner = Details2;
} else {
  BgBanner = Details3;
}

class WishList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      posts: [],
      loading: false,
      title: ""
    };
  }

  async componentDidMount() {
    await this.props.searchPostsByTitle({ userId: localStorage.userId, size: 20, page: 1 });
    this.setState({
      ...this.state,
      posts: this.props.wishlist.searchResults,
      title: this.props.wishlist.searchParams.title,
      loading: true,
    });
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
      posts: data.resultPosts,
    });
  };

  async onSubmit(e) {
    e.preventDefault();
    let searchData = {userId: localStorage.userId, size:20, page: 1};
    if (this.state.title !== "") {
      searchData["title"] = this.state.title;
    }

    await this.props.searchPostsByTitle(searchData);
    this.setState({
      ...this.state,
      posts: this.props.wishlist.searchResults,
    });
  }

  async onRemoveFromWishList(postId) {
    await this.props.removeFromWishList({
      userId: localStorage.userId,
      postId: postId,
    });
    if (this.state.title !== "") {
      await this.props.searchPostsByTitle({ userId: localStorage.userId, size: 20, page: 1, title: this.state.title });
    } else {
      await this.props.searchPostsByTitle({ userId: localStorage.userId, size: 20, page: 1 });
    }
    
    this.setState({
      ...this.state,
      posts: this.props.wishlist.searchResults,
    });
  }

  getSearchDataAd() {
    const { title } = this.state;
    let searchData = { size: 20, userId: localStorage.userId };
    if (title !== "") {
      searchData["title"] = title;
    }
    return searchData;
  }

  render() {
    const { posts, loading } = this.state;
    if (!loading) {
      return (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      );
    } else {
      const searchData = this.getSearchDataAd();

      let pagination =
      posts.totalItems && posts.totalItems > 0 ? (
        <Pagination
          totalPages={posts.totalPages}
          currentPage={posts.currentPage}
          searchData={searchData}
          getChildState={this.getChildStatePagination}
          type="wishlist"
        />
      ) : (
        <></>
      );

      const PostContent = posts.posts.map((post) => {
        return (
          <div className="col-xs-12">
            <div className="item-block">
              <header>
                <a>
                {post.Companies[0].img_url || post.Companies[0].img_url !== "" ? <img src={post.Companies[0].img_url} alt="" /> : <img src={TheJobs} alt="" />}
                </a>
                <div className="hgroup">
                  <h4>
                    {post.is_deleted === 0 ? <a href={`/post/${post.postId}`}>{normalizeLongName(post.title)}</a> : <a href={`/post/${post.postId}`}>{normalizeLongName(post.title)} (Đã xóa)</a>}
                  </h4>
                  <h5>
                    <a>{normalizeLongName(post.Companies[0].name)}</a>
                  </h5>
                </div>
                <div className="header-meta">
                  <span className="location">{normalizeLongName(post.address)}</span>
                  <time datetime="2016-03-10 20:00">{post.valid_through}</time>
                </div>
              </header>

              <footer>
                <p className="status">
                  <strong>Thao tác:</strong>
                </p>

                <div className="action-btn">
                  <a
                    className="btn btn-xs btn-danger"
                    onClick={() => this.onRemoveFromWishList(post.postId)}
                  >
                    Xóa
                  </a>
                </div>
              </footer>
            </div>
          </div>
        );
      });
      return (
        <>
          <header
            className="page-header bg-img size-lg"
            style={{
              backgroundImage: `url(${BgBanner})`,
            }}
          >
            <div className="container no-shadow">
              <h1 className="text-center">Danh sách yêu thích</h1>
              <p className="lead text-center">
                Dưới đây là danh sách các công việc mà bạn đã thích. Bạn có thể
                xem và xóa chúng khỏi danh sách
              </p>
            </div>
            <div className="container">
              <form action="#" onSubmit={(e) => this.onSubmit(e)}>
                <div className="row">
                  <div className="form-group col-xs-12 col-sm-2">
                    <label>Tên tiêu đề: </label>
                  </div>
                  <div className="form-group col-xs-12 col-sm-10">
                    <input
                      name="title"
                      value={this.state.title}
                      onChange={(e) => this.onChange(e)}
                      placeholder="Tên tiêu đề"
                      style={{width: "50%"}}
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
          <div style={{ height: 50 }}></div>
          <main>
            <section className="no-padding-top bg-alt">
              <div className="container">
                <div className="row">
                  {PostContent}
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

WishList.propTypes = {
  wishlist: PropTypes.object.isRequired,
  getWishList: PropTypes.func.isRequired,
  removeFromWishList: PropTypes.func.isRequired,
  getWishListWithSize: PropTypes.func.isRequired,
  searchPostsByTitle: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({ wishlist: state.wishlist });

const mapDispatchToProps = { getWishList, removeFromWishList, searchPostsByTitle };

export default connect(mapStateToProps, mapDispatchToProps)(WishList);
