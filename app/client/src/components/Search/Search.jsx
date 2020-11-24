import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getSearchData } from "../../utils/utils";
import Banner from "../../assets/img/banner.jpg";
import { getDataAutoComplete, searchPosts } from "../../actions/post.action";
import PropTypes from "prop-types";
import AutoCompleteText from "../HOC/AutoCompleteText";

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      dataAuto: null,
      positionTypes: "",
      workplaces: "",
      majors: "",
      loading: false,
      // resultPosts: []
    };
  }

  async componentDidMount() {
    await this.props.getDataAutoComplete();
    this.setState({
      ...this.state,
      dataAuto: this.props.posts.autoComplete,
      loading: true,
      redirect: false,
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

  async onSubmit(e) {
    e.preventDefault();
    const { positionTypes, workplaces, majors } = this.state;
    let searchData = {
      position:
        positionTypes === ""
          ? []
          : positionTypes.split(",").map((a) => a.trim()),
      workplace:
        workplaces === "" ? [] : workplaces.split(",").map((a) => a.trim()),
      major: majors === "" ? [] : majors.split(",").map((a) => a.trim()),
    };

    searchData = getSearchData(searchData);
    searchData.size = 20;
    searchData.page = 1;
    await this.props.searchPosts(searchData);
    this.setState({
      ...this.state,
      redirect: true,
    });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/advancedSearch",
            prev: {
              positionTypes: this.state.positionTypes,
              workplaces: this.state.workplaces,
              majors: this.state.majors,
            },
          }}
        />
      );
    }
  };

  render() {
    const { dataAuto, loading } = this.state;
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
        <header
          className="site-header size-lg text-center"
          style={{
            backgroundImage: `url(${Banner})`,
          }}
        >
          {this.renderRedirect()}
          <div className="container">
            <div className="col-xs-12">
              <br />
              <br />
              <h2>
                Hiện tại đang có <mark>{dataAuto.numPosts}</mark> công việc trên
                hệ thống
              </h2>
              <h5 className="font-alt">
                Tìm công việc bạn mong muốn trên hệ thống
              </h5>
              <br />
              <br />
              <br />
              <form
                className="header-job-search"
                onSubmit={(e) => this.onSubmit(e)}
              >
                <div className="input-keyword">
                  <AutoCompleteText
                    name="positionTypes"
                    items={dataAuto.positions}
                    value=""
                    getChildState={this.getChildState}
                    placeholder="Vị trí "
                  />
                </div>

                <div className="input-location">
                  <AutoCompleteText
                    name="workplaces"
                    items={dataAuto.workplaces}
                    value=""
                    getChildState={this.getChildState}
                    placeholder="Địa điểm"
                  />
                </div>

                <div className="input-major">
                  <AutoCompleteText
                    name="majors"
                    items={dataAuto.majors}
                    value=""
                    getChildState={this.getChildState}
                    placeholder="Ngành nghề"
                  />
                </div>

                <div className="btn-search">
                  <button className="btn btn-primary" type="submit">
                    Tìm kiếm
                  </button>
                  <Link to="/advancedSearch">Tìm kiếm nâng cao</Link>
                </div>
              </form>
            </div>
          </div>
        </header>
      );
    }
  }
}

Search.propTypes = {
  posts: PropTypes.object.isRequired,
  getDataAutoComplete: PropTypes.func.isRequired,
  searchPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({ posts: state.posts });

const mapDispatchToProps = { getDataAutoComplete, searchPosts };

export default connect(mapStateToProps, mapDispatchToProps)(Search);
