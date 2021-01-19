import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Details1 from "../../assets/img/details1.jpg";
import Details2 from "../../assets/img/details2.jpg";
import Details3 from "../../assets/img/details3.jpg";
import {
  getCompanyById,
  getPostByCompanyId,
} from "../../actions/company.action";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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

class CompanyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyId: this.props.match.params.id,
      companyDetails: {},
      isLoading: true,
      resultPosts: {},
    };
  }

  async componentDidMount() {
    let params = {
      size: 10,
      page: 1,
      companyId: this.props.match.params.id,
    };
    await this.props.getPostByCompanyId(params);
    await this.props.getCompanyById(this.props.match.params.id);
    this.setState({
      ...this.state,
      companyDetails: this.props.company.companyDetails,
      resultPosts: this.props.posts.searchResults,
      isLoading: false,
    });
  }

  getChildStatePagination = (data) => {
    this.setState({
      ...this.state,
      resultPosts: data.resultPosts,
    });
  };

  render() {
    const { companyDetails, isLoading, resultPosts, companyId } = this.state;

    const params = {
      size: 10,
      page: 1,
      companyId: companyId,
    };

    if (isLoading) {
      return (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      );
    } else {
      // console.log(pagination)
      let compDesc;
      if (companyDetails.description.includes("\n")) {
        compDesc = companyDetails.description.split("\n");
      }
      let pagination =
        resultPosts.totalItems && resultPosts.totalItems > 0 ? (
          <Pagination
            totalPages={resultPosts.totalPages}
            currentPage={resultPosts.currentPage}
            searchData={params}
            type="company"
            getChildState={this.getChildStatePagination}
          />
        ) : (
          <></>
        );
      let companyDescription = <></>;
      if (companyDetails.description !== "" && compDesc !== undefined) {
        companyDescription = (
          <div className="container">
            <header className="section-header">
              <span>Mô tả</span>
              <h2>Giới thiệu về công ty</h2>
            </header>
            {compDesc.map((e) => {
              return <p>{e}</p>;
            })}
          </div>
        );
      } else if (companyDetails.description !== "" && compDesc === undefined) {
        companyDescription = (
          <div className="container">
            <header className="section-header">
              <span>Mô tả</span>
              <h2>Giới thiệu về công ty</h2>
            </header>
            <p>{companyDetails.description}</p>
          </div>
        );
      }

      let PostDesc = resultPosts.posts ? (
        resultPosts.posts.map((post) => {
          return (
            <div className="col-xs-12">
              <a className="item-block" href={`/post/${post.postId}`}>
                <header>
                {post.Companies[0].img_url || post.Companies[0].img_url !== "" ? <img src={post.Companies[0].img_url} alt="" /> : <img src={TheJobs} alt="" />}
                  <div className="hgroup">
                    <h4>{post.position}</h4>
                    <h5>
                      {post.title}{" "}
                      <span className="label label-success">
                        {post.job_type}
                      </span>
                    </h5>
                  </div>
                  <time datetime="2016-03-10 20:00">{post.valid_through}</time>
                </header>

                <footer>
                  <ul className="details cols-12">
                    <li>
                      <i className="fa fa-map-marker"></i>
                      <span>{post.address}</span>
                    </li>
                  </ul>
                  <ul className="details cols-3">
                    <li>
                      <i className="fa fa-money"></i>
                      <span>{post.salary_type} (VND)</span>
                    </li>

                    <li>
                      <i className="fa fa-certificate"></i>
                      <span>{post.qualification}</span>
                    </li>
                  </ul>
                </footer>
              </a>
            </div>
          );
        })
      ) : (
        <></>
      );

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
                <img className="logo" src={companyDetails.img_url} alt="" />
                <div className="hgroup">
                  {/* <h1>{companyDetails.name}</h1> */}
                  <h2>{companyDetails.name}</h2>
                </div>
                <hr />
                {/* <p className="lead">{companyDetails.description}</p> */}

                <ul className="details cols-12">
                  <li>
                    <i className="fa fa-map-marker"></i>
                    <span>{companyDetails.address}</span>
                  </li>
                </ul>

                <div className="button-group">
                  <ul className="social-icons">
                    <li>
                      <a className="facebook" href="#">
                        <i className="fa fa-facebook"></i>
                      </a>
                    </li>
                    <li>
                      <a className="twitter" href="#">
                        <i className="fa fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a className="dribbble" href="#">
                        <i className="fa fa-dribbble"></i>
                      </a>
                    </li>
                    <li>
                      <a className="linkedin" href="#">
                        <i className="fa fa-linkedin"></i>
                      </a>
                    </li>
                    <li>
                      <a className="instagram" href="#">
                        <i className="fa fa-instagram"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </header>

          <main>
            <section>{companyDescription}</section>

            <section id="open-positions" className="bg-alt">
              <div className="container">
                <header className="section-header">
                  <span>Công việc</span>
                  <h2>Các công việc trên hệ thống</h2>
                </header>

                {PostDesc}
                <nav className="text-center">{pagination}</nav>
              </div>
            </section>
            {/* <section className="no-padding-top bg-alt">
              <div style={{ height: 80 }}></div>
              <div className="container">
                <div className="row item-blocks-condensed">
                  {PostDesc}
                </div>

                <nav className="text-center">{pagination}</nav>
              </div>
            </section> */}
          </main>
        </>
      );
    }
  }
}

CompanyDetails.propTypes = {
  posts: PropTypes.object.isRequired,
  company: PropTypes.object.isRequired,
  getCompanyById: PropTypes.func.isRequired,
  getPostByCompanyId: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  company: state.company,
});

const mapDispatchToProps = {
  getCompanyById,
  getPostByCompanyId,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CompanyDetails));
