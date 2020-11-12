import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Banner from "../../assets/img/banner_details.jpg";
import {
  getDataAutoComplete,
  searchPosts,
} from "../../actions/post.action";
import PropTypes from "prop-types";
import AutoCompleteText from "../HOC/AutoCompleteText";
// import "./AdvancedSearch.scss";
import classnames from "classnames";

class AdvancedSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      dataAuto: null,
      positionTypes: "",
      workplaces: "",
      majors: "",
      loading: false,
      resultPosts: [],
    };
  }

  async componentDidMount() {
    await this.props.getDataAutoComplete();
    this.setState({
      ...this.state,
      dataAuto: this.props.posts.autoComplete,
      resultPosts: this.props.posts.postData,
      loading: true,
    });
  }

  getChildState = (data) => {
    if (data.name === "positionTypes") {
      this.setState({
        ...this.state,
        positionTypes: data.text,
      });
    } else if (data.name === "workplaces") {
      this.setState({
        ...this.state,
        workplaces: data.text,
      });
    } else if (data.name === "majors") {
      this.setState({
        ...this.state,
        majors: data.text,
      });
    }
  };

  async onSearchClick() {
    const { positionTypes, workplaces, majors } = this.state;
    const searchData = {
      positions: positionTypes,
      workplaces: workplaces,
      majors: majors,
    };
    await this.props.searchPosts(searchData);
    this.setState({
      ...this.state,
      resultPosts: this.props.posts.postData,
    });
  }

  render() {
    const { numAllPosts, dataAuto, loading, resultPosts } = this.state;
    let PostComp = resultPosts.map((post) => {
      return (
        <div className="col-xs-12">
          <a className="item-block" href="job-detail.html">
            <header>
              <img src={post.img} alt="" />
              <div className="hgroup">
                <h4>{post.title}</h4>
                <h5>{post.companyTitle}</h5>
              </div>
              <div className="header-meta">
                <span className="location">{post.workplace}</span>
                <span className="label label-success">{post.salary}</span>
              </div>
            </header>
          </a>
        </div>
      );
    });
    if (!loading) {
      return <></>;
    } else {
      return (
        <>
          <header
            className="page-header bg-img"
            style={{ backgroundImage: `url(${Banner})` }}
          >
            <div className="container page-name">
              <h1 className="text-center">Browse jobs</h1>
              <p className="lead text-center">
                Use following search box to find jobs that fits you better
              </p>
            </div>

            <div className="container">
              <form action="#">
                <div className="row">
                  <div className="form-group col-xs-12 col-sm-4">
                    <AutoCompleteText
                      name="positionTypes"
                      items={dataAuto.positions}
                      value=""
                      getChildState={this.getChildState}
                      placeholder="Vị trí mong muốn ứng tuyển"
                    />
                  </div>

                  <div className="form-group col-xs-12 col-sm-4">
                    <AutoCompleteText
                      name="workplaces"
                      items={dataAuto.workplaces}
                      value=""
                      getChildState={this.getChildState}
                      placeholder="Địa điểm làm việc"
                    />
                  </div>

                  <div className="form-group col-xs-12 col-sm-4">
                    <AutoCompleteText
                      name="majors"
                      items={dataAuto.majors}
                      value=""
                      getChildState={this.getChildState}
                      placeholder="Ngành nghề mong muốn"
                    />
                  </div>

                  <div className="form-group col-xs-12 col-sm-4">
                    <select class="form-control">
                      <option selected>Mức lương</option>
                      {dataAuto.salary.map((s) => {
                        return <option value={s}>{s}</option>;
                      })}
                    </select>
                  </div>

                  <div className="form-group col-xs-12 col-sm-4">
                    <h6>Kinh nghiệm</h6>
                    <div className="checkall-group">
                      {dataAuto.experience.map((ex) => {
                        return (
                          <div className="checkbox">
                            <input type="checkbox" id={ex} name="rate" />
                            <label for={ex}>{ex}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-group col-xs-12 col-sm-4">
                    <h6>Hình thức làm việc</h6>
                    <div className="checkall-group">
                      {dataAuto.jobTypes.map((jT) => {
                        return (
                          <div className="checkbox">
                            <input type="checkbox" id={jT} name="degree" />
                            <label for={jT}>{jT}</label>
                          </div>
                        );
                      })}
                    </div>
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

          <main>
            <section className="no-padding-top bg-alt">
              <div style={{ height: 80 }}></div>
              <div className="container">
                <div className="row item-blocks-condensed">
                  <div className="col-xs-12">
                    <br />
                    <h5>
                      We found <strong>357</strong> matches, you're watching{" "}
                      <i>10</i> to <i>20</i>
                    </h5>
                  </div>

                  {PostComp}
                </div>

                <nav className="text-center">
                  <ul className="pagination">
                    <li>
                      <a href="#" aria-label="Previous">
                        <i className="ti-angle-left"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">1</a>
                    </li>
                    <li className="active">
                      <a href="#">2</a>
                    </li>
                    <li>
                      <a href="#">3</a>
                    </li>
                    <li>
                      <a href="#">4</a>
                    </li>
                    <li>
                      <a href="#" aria-label="Next">
                        <i className="ti-angle-right"></i>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </section>
          </main>
        </>
      );
    }
  }
}

AdvancedSearch.propTypes = {
  posts: PropTypes.object.isRequired,
  getDataAutoComplete: PropTypes.func.isRequired,
  searchPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ posts: state.posts });

const mapDispatchToProps = { getDataAutoComplete, searchPosts };

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearch);
