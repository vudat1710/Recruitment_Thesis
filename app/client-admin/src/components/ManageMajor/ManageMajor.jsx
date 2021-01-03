import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Banner from "../../assets/img/banner_details.jpg";
import { getDataAutoComplete } from "../../actions/post.action";
import { getMajorByName, deleteMajor } from "../../actions/major.action";
import PropTypes from "prop-types";
import AutoCompleteText from "../HOC/AutoCompleteText";
import Pagination from "../Pagination/Pagination";
import { majors } from "../../utils/utils";
// import classnames from "classnames";

class ManageMajor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      dataAuto: null,
      name: "",
      loading: false,
      resultMajors: {},
      page: 1,
      majors: [],
    };
  }

  async componentDidMount() {
    await this.props.getDataAutoComplete();

    this.setState({
      ...this.state,
      dataAuto: this.props.posts.autoComplete,
      resultMajors: this.props.major.searchResults,
      name: this.props.major.searchParams.name,
      loading: true,
      majors: this.props.major.searchResults.majors,
    });
  }

  onChange(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  }

  getSearchDataAd() {
    const { name } = this.state;
    const searchData = { name: name, size: 20 };
    return searchData;
  }

  getChildState = (data) => {
    if (data.name === "name") {
      this.setState({
        ...this.state,
        name: data.text,
      });
    }
  };

  getChildStatePagination = (data) => {
    this.setState({
      ...this.state,
      resultMajors: data.resultPosts,
      majors: data.resultPosts.majors,
    });
  };

  async onDeleteClick(majorId) {
    await this.props.deleteMajor({ majorId: majorId });
    this.setState({
      ...this.state,
      majors: this.state.majors.filter((a) => a.majorId !== majorId),
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    let searchData = this.getSearchDataAd();
    searchData.page = 1;

    await this.props.getMajorByName(searchData);
    this.setState({
      ...this.state,
      resultMajors: this.props.major.searchResults,
      majors: this.props.major.searchResults.majors,
    });
  }

  render() {
    const { dataAuto, loading, resultMajors, name } = this.state;

    let searchData = this.getSearchDataAd();
    let MajorComp = this.state.majors ? (
      this.state.majors.map((major) => {
        return (
          <div className="col-xs-12">
            <a className="item-block">
              <header>
                <div className="hgroup">
                  <h4>
                    <a>{major.name}</a>
                  </h4>
                </div>
              </header>

              <footer>
                <ul className="details cols-3">
                  <div class="action-btn">
                    <a
                      class="btn btn-xs btn-gray"
                      href={`/editMajor/${major.majorId}`}
                    >
                      Edit
                    </a>
                    {majors.includes(major.name) ? (
                      <></>
                    ) : (
                      <a
                        class="btn btn-xs btn-danger"
                        onClick={() => this.onDeleteClick(major.majorId)}
                      >
                        Delete
                      </a>
                    )}
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
      resultMajors.totalItems && resultMajors.totalItems > 0 ? (
        <Pagination
          totalPages={resultMajors.totalPages}
          currentPage={resultMajors.currentPage}
          searchData={searchData}
          getChildState={this.getChildStatePagination}
          type="major"
        />
      ) : (
        <></>
      );

    let extraComp = resultMajors.currentPage ? (
      <h5>
        Hệ thống đã tìm thấy <strong>{resultMajors.totalItems}</strong> kết quả,
        bạn đang xem trang thứ <i>{resultMajors.currentPage}</i> trong tổng số{" "}
        <i>{resultMajors.totalPages} trang</i>
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
                Quản lý các ngành nghề trên hệ thống
              </h1>
              <p className="lead text-center">
                Lựa chọn các tiêu chí dưới đây để tìm ngành nghề
              </p>
            </div>

            <div className="container">
              <div className="col-xs-12 text-right">
                <br />
                <Link
                  className="btn btn-primary btn-sm"
                  to={{ pathname: `/addMajor`, type: "add" }}
                >
                  Thêm ngành nghề
                </Link>
              </div>
              <div style={{ height: 70 }} />
              <form action="#" onSubmit={(e) => this.onSubmit(e)}>
                <div className="row">
                  <div className="form-group col-xs-12 col-sm-2">
                    <label>Tên ngành nghề: </label>
                  </div>
                  <div className="form-group col-xs-12 col-sm-10">
                    <AutoCompleteText
                      name="name"
                      items={dataAuto.majors}
                      value={name}
                      getChildState={this.getChildState}
                      placeholder="Tên ngành nghề"
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

          <main>
            <section className="no-padding-top bg-alt">
              <div style={{ height: 80 }}></div>
              <div className="container">
                <div className="row item-blocks-condensed">
                  <div className="col-xs-12">
                    <br />
                    {extraComp}
                  </div>

                  {MajorComp}
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

ManageMajor.propTypes = {
  posts: PropTypes.object.isRequired,
  major: PropTypes.object.isRequired,
  getDataAutoComplete: PropTypes.func.isRequired,
  getMajorByName: PropTypes.func.isRequired,
  deleteMajor: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  major: state.major,
});

const mapDispatchToProps = {
  getDataAutoComplete,
  getMajorByName,
  deleteMajor,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageMajor);
