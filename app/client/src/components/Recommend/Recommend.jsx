import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Details1 from "../../assets/img/details1.jpg";
import Details2 from "../../assets/img/details2.jpg";
import Details3 from "../../assets/img/details3.jpg";
import { normalizeLongName, normalizeWorkPlaces } from "../../utils/utils";
import TheJobs from "../../assets/img/logo2.png";

let BgBanner;
if (Math.floor(Math.random() * 3 + 1) === 1) {
  BgBanner = Details1;
} else if (Math.floor(Math.random() * 3 + 1) === 2) {
  BgBanner = Details2;
} else {
  BgBanner = Details3;
}

class Recommend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      posts: [],
      loading: false,
    };
  }

  async componentDidMount() {
    this.setState({
      ...this.state,
      posts: this.props.recommend.userRecommend,
      loading: true,
    });
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
      const PostContent = posts.map((post) => {
        return (
          <div className="col-xs-12">
            <a className="item-block" href={`/post/${post.post.postId}`}>
              <header>
              {post.post.img || post.post.img !== "" ? <img src={post.post.img} alt="" /> : <img src={TheJobs} alt="" />}
                <div className="hgroup">
                  <h4>{normalizeLongName(post.post.title)}</h4>
                  <h5>
                    {normalizeLongName(post.post.name)}{" "}
                    <span className="label label-success">{post.post.job_type}</span>
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
                    <span>{normalizeWorkPlaces(post.post.WorkPlaces.split(",").map(a => a.trim()))}</span>
                  </li>

                  <li>
                    <i className="fa fa-money"></i>
                    <span>{post.post.salary_type}</span>
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
              <h1 className="text-center">Việc làm phù hợp</h1>
              <p className="lead text-center">
                Các việc làm phù hợp với hồ sơ của bạn
              </p>
            </div>
          </header>
          <div style={{ height: 50 }}></div>
          <main>
            <section className="no-padding-top bg-alt">
              <div className="container">
                <div className="row">{PostContent}</div>
              </div>
            </section>
          </main>
        </>
      );
    }
  }
}

Recommend.propTypes = {
  recommend: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ recommend: state.recommend });

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Recommend);
