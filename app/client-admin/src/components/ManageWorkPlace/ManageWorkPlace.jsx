import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Banner from "../../assets/img/banner_details.jpg";
import { getDataAutoComplete } from "../../actions/post.action";
import {
  getWorkPlaceByName,
  deleteWorkPlace,
} from "../../actions/workplace.action";
import PropTypes from "prop-types";
import AutoCompleteText from "../HOC/AutoCompleteText";
import Pagination from "../Pagination/Pagination";
import { workPlaces } from "../../utils/utils";
// import classnames from "classnames";

class ManageWorkPlace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      dataAuto: null,
      name: "",
      loading: false,
      resultWorkPlaces: {},
      page: 1,
      workPlaces: [],
    };
  }

  async componentDidMount() {
    await this.props.getDataAutoComplete();

    this.setState({
      ...this.state,
      dataAuto: this.props.posts.autoComplete,
      resultWorkPlaces: this.props.workPlace.searchResults,
      name: this.props.workPlace.searchParams.name,
      loading: true,
      workPlaces: this.props.workPlace.searchResults.workPlaces,
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
      resultWorkPlaces: data.resultPosts,
      workPlaces: data.resultPosts.workPlaces,
    });
  };

  async onDeleteClick(workPlaceId) {
    await this.props.deleteWorkPlace({ workPlaceId: workPlaceId });
    this.setState({
      ...this.state,
      workPlaces: this.state.workPlaces.filter(
        (a) => a.workPlaceId !== workPlaceId
      ),
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    let searchData = this.getSearchDataAd();
    searchData.page = 1;

    await this.props.getWorkPlaceByName(searchData);
    this.setState({
      ...this.state,
      resultWorkPlaces: this.props.workPlace.searchResults,
      workPlaces: this.props.workPlace.searchResults.workPlaces,
    });
  }

  render() {
    const { dataAuto, loading, resultWorkPlaces, name } = this.state;

    let searchData = this.getSearchDataAd();
    let WorkPlaceComp = this.state.workPlaces ? (
      this.state.workPlaces.map((workPlace) => {
        return (
          <div className="col-xs-12">
            <a className="item-block">
              <header>
                <div className="hgroup">
                  <h4>
                    <a>{workPlace.name}</a>
                  </h4>
                </div>
              </header>

              <footer>
                <ul className="details cols-3">
                  <div class="action-btn">
                    <a
                      class="btn btn-xs btn-gray"
                      href={`/editWorkPlace/${workPlace.workPlaceId}`}
                    >
                      Edit
                    </a>
                    {workPlaces.includes(workPlace.name) ? (
                      <></>
                    ) : (
                      <a
                        class="btn btn-xs btn-danger"
                        onClick={() =>
                          this.onDeleteClick(workPlace.workPlaceId)
                        }
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
      resultWorkPlaces.totalItems && resultWorkPlaces.totalItems > 0 ? (
        <Pagination
          totalPages={resultWorkPlaces.totalPages}
          currentPage={resultWorkPlaces.currentPage}
          searchData={searchData}
          getChildState={this.getChildStatePagination}
          type="workPlace"
        />
      ) : (
        <></>
      );

    let extraComp = resultWorkPlaces.currentPage ? (
      <h5>
        Hệ thống đã tìm thấy <strong>{resultWorkPlaces.totalItems}</strong> kết
        quả, bạn đang xem trang thứ <i>{resultWorkPlaces.currentPage}</i> trong
        tổng số <i>{resultWorkPlaces.totalPages} trang</i>
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
                Quản lý các địa điểm làm việc trên hệ thống
              </h1>
              <p className="lead text-center">
                Lựa chọn các tiêu chí dưới đây để tìm địa điểm làm việc
              </p>
            </div>

            <div className="container">
              <div className="col-xs-12 text-right">
                <br />
                <Link
                  className="btn btn-primary btn-sm"
                  to={{ pathname: `/addWorkPlace`, type: "add" }}
                >
                  Thêm địa điểm làm việc
                </Link>
              </div>
              <div style={{ height: 70 }} />
              <form action="#" onSubmit={(e) => this.onSubmit(e)}>
                <div className="row">
                  <div className="form-group col-xs-12 col-sm-2">
                    <label>Tên địa điểm làm việc: </label>
                  </div>
                  <div className="form-group col-xs-12 col-sm-10">
                    <AutoCompleteText
                      name="name"
                      items={dataAuto.workplaces}
                      value={name}
                      getChildState={this.getChildState}
                      placeholder="Tên địa điểm làm việc"
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

                  {WorkPlaceComp}
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

ManageWorkPlace.propTypes = {
  posts: PropTypes.object.isRequired,
  workPlace: PropTypes.object.isRequired,
  getDataAutoComplete: PropTypes.func.isRequired,
  getWorkPlaceByName: PropTypes.func.isRequired,
  deleteWorkPlace: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  workPlace: state.workPlace,
});

const mapDispatchToProps = {
  getDataAutoComplete,
  getWorkPlaceByName,
  deleteWorkPlace,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageWorkPlace);
