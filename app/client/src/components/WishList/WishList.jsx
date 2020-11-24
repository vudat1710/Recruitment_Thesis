import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getWishList, removeFromWishList } from "../../actions/wishlist.action";
import PropTypes from "prop-types";
import Details1 from "../../assets/img/details1.jpg";
import Details2 from "../../assets/img/details2.jpg";
import Details3 from "../../assets/img/details3.jpg";

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
    };
  }

  async componentDidMount() {
    await this.props.getWishList({ userId: localStorage.userId });
    this.setState({
      ...this.state,
      posts: this.props.wishlist.posts,
      loading: true,
    });
  }

  async onRemoveFromWishList(postId) {
    await this.props.removeFromWishList({
      userId: localStorage.userId,
      postId: postId
    });
    this.setState({
      ...this.state,
      posts: this.state.posts.filter((a) => a.postId !== postId),
    });
  }

  render() {
    const { posts, loading } = this.state;
    if (!loading) {
      return <></>;
    } else {
      const PostContent = posts.map((post) => {
        return (
          <div className="col-xs-12">
            <div className="item-block">
              <header>
                <a href="company-detail.html">
                  <img src={post.Companies[0].img_url} alt="" />
                </a>
                <div className="hgroup">
                  <h4>
                    <a href={`/post/${post.postId}`}>{post.title}</a>
                  </h4>
                  <h5>
                    <a href="company-detail.html">{post.Companies[0].name}</a>
                  </h5>
                </div>
                <div className="header-meta">
                  <span className="location">{post.address}</span>
                  <time datetime="2016-03-10 20:00">{post.valid_through}</time>
                </div>
              </header>

              <footer>
                <p className="status">
                  <strong>Thao tác:</strong>
                </p>

                <div className="action-btn">
                  <a className="btn btn-xs btn-danger" onClick={() => this.onRemoveFromWishList(post.postId)}>
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
          </header>
          <div style={{ height: 50 }}></div>
          <main>
            <section className="no-padding-top bg-alt">
              <div className="container">
                <div className="row">
                  {/* <div className="col-xs-12 text-right">
                    <br />
                    <a className="btn btn-primary btn-sm" href="job-add.html">
                      Add new job
                    </a>
                  </div> */}
                  {PostContent}
                </div>
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
};

const mapStateToProps = (state) => ({ wishlist: state.wishlist });

const mapDispatchToProps = { getWishList, removeFromWishList };

export default connect(mapStateToProps, mapDispatchToProps)(WishList);
