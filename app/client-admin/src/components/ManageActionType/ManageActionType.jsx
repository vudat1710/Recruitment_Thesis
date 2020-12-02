import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Banner from "../../assets/img/banner_details.jpg";
import { getActionTypeByName, deleteActionType } from "../../actions/action.action";
import PropTypes from "prop-types";
import AutoCompleteText from "../HOC/AutoCompleteText";
import Pagination from "../Pagination/Pagination";

class ManageActionTypes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      name: "",
      loading: false,
      resultActionTypes: {},
      page: 1,
      actions: [],
    };
  }

  async componentDidMount() {
    this.setState({
      ...this.state,
      resultActionTypes: this.props.actions.searchResults,
      name: this.props.actions.searchParams.name,
      loading: true,
      actions: this.props.actions.searchResults.actions,
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
      resultActionTypes: data.resultPosts,
      actions: data.resultPosts.actions,
    });
  };

  async onDeleteClick(actionTypeId) {
    await this.props.deleteActionType({ actionTypeId: actionTypeId });
    this.setState({
      ...this.state,
      actions: this.state.actions.filter((a) => a.actionTypeId !== actionTypeId),
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    let searchData = this.getSearchDataAd();
    searchData.page = 1;

    await this.props.getActionTypeByName(searchData);
    this.setState({
      ...this.state,
      resultActionTypes: this.props.actions.searchResults,
      actions: this.props.actions.searchResults.actions,
    });
  }

  render() {
    const { loading, resultActionTypes, name } = this.state;

    let searchData = this.getSearchDataAd();
    let ActionComp = this.state.actions ? (
      this.state.actions.map((action) => {
        return (
          <div className="col-xs-12">
            <a className="item-block">
              <header>
                <div className="hgroup">
                  <h4>
                    <a>{action.name}</a>
                  </h4>
                </div>
              </header>

              <footer>
                <ul className="details cols-3">
                  <div class="action-btn">
                    <a
                      class="btn btn-xs btn-gray"
                      href={`/editActionType/${action.actionTypeId}`}
                    >
                      Edit
                    </a>
                    <a
                      class="btn btn-xs btn-danger"
                      onClick={() => this.onDeleteClick(action.actionTypeId)}
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
      resultActionTypes.totalItems && resultActionTypes.totalItems > 0 ? (
        <Pagination
          totalPages={resultActionTypes.totalPages}
          currentPage={resultActionTypes.currentPage}
          searchData={searchData}
          getChildState={this.getChildStatePagination}
          type="actions"
        />
      ) : (
        <></>
      );

    let extraComp = resultActionTypes.currentPage ? (
      <h5>
        Hệ thống đã tìm thấy <strong>{resultActionTypes.totalItems}</strong> kết
        quả, bạn đang xem trang thứ <i>{resultActionTypes.currentPage}</i> trong
        tổng số <i>{resultActionTypes.totalPages} trang</i>
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
              <h1 className="text-center">Quản lý các hành động trên hệ thống</h1>
              <p className="lead text-center">
                Lựa chọn các tiêu chí dưới đây để tìm hành động
              </p>
            </div>

            <div className="container">
              <div className="col-xs-12 text-right">
                <br />
                <Link
                  className="btn btn-primary btn-sm"
                  to={{ pathname: `/addActionType`, type: "add" }}
                >
                  Thêm hành động
                </Link>
              </div>
              <div style={{ height: 70 }} />
              <form action="#" onSubmit={(e) => this.onSubmit(e)}>
                <div className="row">
                  <div className="form-group col-xs-12 col-sm-2">
                    <label>Tên hành động: </label>
                  </div>
                  <div className="form-group col-xs-12 col-sm-10">
                    <AutoCompleteText
                      name="name"
                      items={[]}
                      value={name}
                      getChildState={this.getChildState}
                      placeholder="Tên hành động"
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

                  {ActionComp}
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

ManageActionTypes.propTypes = {
  actions: PropTypes.object.isRequired,
  getActionTypeByName: PropTypes.func.isRequired,
  deleteActionType: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  actions: state.actions,
});

const mapDispatchToProps = {
  getActionTypeByName,
  deleteActionType,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageActionTypes);
