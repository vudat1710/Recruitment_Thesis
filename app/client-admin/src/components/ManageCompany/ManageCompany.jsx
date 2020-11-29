import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Banner from "../../assets/img/banner_details.jpg";
import { getDataAutoComplete } from "../../actions/post.action";
import { searchCompanies, deleteCompany } from "../../actions/company.action";
import PropTypes from "prop-types";
import AutoCompleteText from "../HOC/AutoCompleteText";
import Pagination from "../Pagination/Pagination";
// import classnames from "classnames";

class ManagePost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      dataAuto: null,
      name: "",
      loading: false,
      resultCompanies: {},
      page: 1,
      companies: [],
    };
  }

  async componentDidMount() {
    await this.props.getDataAutoComplete();

    this.setState({
      ...this.state,
      dataAuto: this.props.posts.autoComplete,
      resultCompanies: this.props.company.searchResults,
      name: this.props.company.searchParams.name,
      loading: true,
      companies: this.props.company.searchResults.companies,
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
      resultCompanies: data.resultPosts,
      companies: data.resultPosts.companies,
    });
  };

  async onDeleteClick(companyId) {
    await this.props.deleteCompany({ companyId: companyId });
    this.setState({
      ...this.state,
      companies: this.state.companies.filter((a) => a.companyId !== companyId),
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    let searchData = this.getSearchDataAd();
    searchData.page = 1;

    await this.props.searchCompanies(searchData);
    this.setState({
      ...this.state,
      resultCompanies: this.props.company.searchResults,
      companies: this.props.company.searchResults.companies,
    });
  }

  render() {
    const { dataAuto, loading, resultCompanies, name } = this.state;

    let searchData = this.getSearchDataAd();
    let CompanyComp = this.state.companies ? (
      this.state.companies.map((company) => {
        return (
          <div className="col-xs-12">
            <a className="item-block">
              <header>
                <img src={company.img_url} alt="" />
                <div className="hgroup">
                  <h4>
                    <a href={`/company/${company.companyId}`}>{company.name}</a>
                  </h4>
                  <h5>{company.address}</h5>
                </div>
              </header>

              <footer>
                <ul className="details cols-3">
                  <div class="action-btn">
                    <a
                      class="btn btn-xs btn-gray"
                      href={`/editCompany/${company.companyId}`}
                    >
                      Edit
                    </a>
                    <a
                      class="btn btn-xs btn-danger"
                      onClick={() => this.onDeleteClick(company.companyId)}
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
      resultCompanies.totalItems && resultCompanies.totalItems > 0 ? (
        <Pagination
          totalPages={resultCompanies.totalPages}
          currentPage={resultCompanies.currentPage}
          searchData={searchData}
          getChildState={this.getChildStatePagination}
          type="companyAdmin"
        />
      ) : (
        <></>
      );

    let extraComp = resultCompanies.currentPage ? (
      <h5>
        Hệ thống đã tìm thấy <strong>{resultCompanies.totalItems}</strong> kết
        quả, bạn đang xem trang thứ <i>{resultCompanies.currentPage}</i> trong
        tổng số <i>{resultCompanies.totalPages} trang</i>
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
              <h1 className="text-center">Quản lý các công ty trên hệ thống</h1>
              <p className="lead text-center">
                Lựa chọn các tiêu chí dưới đây để tìm công ty
              </p>
            </div>

            <div className="container">
              <div className="col-xs-12 text-right">
                <br />
                <Link
                  className="btn btn-primary btn-sm"
                  to={{ pathname: `/addCompany`, type: "add" }}
                >
                  Thêm công ty
                </Link>
              </div>
              <div style={{ height: 70 }} />
              <form action="#" onSubmit={(e) => this.onSubmit(e)}>
                <div className="row">
                  <div className="form-group col-xs-12 col-sm-2">
                    <label>Tên công ty: </label>
                  </div>
                  <div className="form-group col-xs-12 col-sm-10">
                    <AutoCompleteText
                      name="name"
                      items={[]}
                      value={name}
                      getChildState={this.getChildState}
                      placeholder="Tên công ty"
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

                  {CompanyComp}
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

ManagePost.propTypes = {
  posts: PropTypes.object.isRequired,
  company: PropTypes.object.isRequired,
  getDataAutoComplete: PropTypes.func.isRequired,
  searchCompanies: PropTypes.func.isRequired,
  deleteCompany: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  company: state.company,
});

const mapDispatchToProps = {
  getDataAutoComplete,
  searchCompanies,
  deleteCompany,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePost);
