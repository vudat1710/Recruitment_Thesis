import React, { Component } from "react";
import { connect } from "react-redux";
import Banner from "../../assets/img/banner_details.jpg";
import {
  searchUsers,
  lockAccount,
  unlockAccount,
  changeState,
} from "../../actions/user.action";
import PropTypes from "prop-types";
import AutoCompleteText from "../HOC/AutoCompleteText";
import Pagination from "../Pagination/Pagination";
import { experienceDict } from "../../utils/utils";
import SweetAlert from "react-bootstrap-sweetalert";

class ManageUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      user_name: "",
      loading: false,
      resultUsers: {},
      page: 1,
      users: [],
      lockAccount: false,
      unlockAccount: false,
      type: "",
      errors: {},
    };
  }

  componentWillReceiveProps(nextPops) {
    if (nextPops.errors) {
      this.setState({ errors: nextPops.errors });
    }
  }

  async componentDidMount() {
    this.setState({
      ...this.state,
      resultUsers: this.props.user.searchResults,
      user_name: this.props.user.searchParams.user_name,
      loading: true,
      users: this.props.user.searchResults.users,
    });
  }

  onChange(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  }

  getSearchDataAd() {
    const { user_name } = this.state;
    const searchData = { user_name: user_name, size: 20 };
    return searchData;
  }

  getChildState = (data) => {
    if (data.name === "user_name") {
      this.setState({
        ...this.state,
        user_name: data.text,
      });
    }
  };

  getChildStatePagination = (data) => {
    this.setState({
      ...this.state,
      resultUsers: data.resultPosts,
      users: data.resultPosts.users,
    });
  };

  async onLockClick(userId) {
    await this.props.lockAccount({ userId: userId });
    this.setState({
      ...this.state,
      lockAccount: this.props.user.lockAccount,
      type: "lock",
    });
  }

  async onUnlockClick(userId) {
    await this.props.unlockAccount({ userId: userId });
    this.setState({
      ...this.state,
      unlockAccount: this.props.user.unlockAccount,
      type: "unlock",
    });
  }

  async onCancelConfirm() {
    await this.props.changeState({ type: this.state.type });

    if (this.state.type === "lock") {
      this.setState({
        ...this.state,
        lockAccount: false,
      });
    } else if (this.state.type === "unlock") {
      this.setState({
        ...this.state,
        unlockAccount: false,
      });
    }
  }

  async onSubmit(e) {
    e.preventDefault();
    let searchData = this.getSearchDataAd();
    searchData.page = 1;

    await this.props.searchUsers(searchData);
    this.setState({
      ...this.state,
      resultUsers: this.props.user.searchResults,
      users: this.props.user.searchResults.users,
    });
  }

  render() {
    const { loading, resultUsers, user_name, errors } = this.state;

    let searchData = this.getSearchDataAd();
    let UserComp = this.state.users ? (
      this.state.users.map((user) => {
        console.log(user);
        return (
          <div className="col-xs-12">
            <a className="item-block">
              <header>
                <div className="hgroup">
                  <h4>
                    <a href={`/user/${user.userId}`}>{user.user_name}</a>
                  </h4>
                </div>
              </header>

              <footer>
                <ul className="details cols-3">
                  {user.WorkPlaces.length !== 0 ? (
                    <li>
                      <i className="fa fa-map-marker"></i>
                      <span>
                        {user.WorkPlaces.map((a) => a.name).join(", ")}
                      </span>
                    </li>
                  ) : (
                    <></>
                  )}

                  {user.Majors.length !== 0 ? (
                    <li>
                      <i className="fa fa-certificate"></i>
                      <span>{user.Majors.map((a) => a.name).join(", ")}</span>
                    </li>
                  ) : (
                    <></>
                  )}

                  {user.salary ? (
                    <li>
                      <i className="fa fa-money"></i>
                      <span>{user.salary}</span>
                    </li>
                  ) : (
                    <></>
                  )}

                  {user.experience ? (
                    <li>
                      <i className="fa fa-flask"></i>
                      <span>{experienceDict[user.experience]}</span>
                    </li>
                  ) : (
                    <></>
                  )}

                  {user.job_type ? (
                    <li>
                      <i className="fa fa-clock-o"></i>
                      <span>{user.job_type}</span>
                    </li>
                  ) : (
                    <></>
                  )}

                  {user.qualification ? (
                    <li>
                      <i className="fa fa-briefcase"></i>
                      <span>{user.qualification}</span>
                    </li>
                  ) : (
                    <></>
                  )}
                  <div class="action-btn">
                    <a
                      class="btn btn-xs btn-gray"
                      onClick={() => this.onUnlockClick(user.userId)}
                    >
                      Mở khóa
                    </a>
                    <a
                      class="btn btn-xs btn-danger"
                      onClick={() => this.onLockClick(user.userId)}
                    >
                      Khóa
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
      resultUsers.totalItems && resultUsers.totalItems > 0 ? (
        <Pagination
          totalPages={resultUsers.totalPages}
          currentPage={resultUsers.currentPage}
          searchData={searchData}
          getChildState={this.getChildStatePagination}
          type="user"
        />
      ) : (
        <></>
      );

    let extraComp = resultUsers.currentPage ? (
      <h5>
        Hệ thống đã tìm thấy <strong>{resultUsers.totalItems}</strong> kết quả,
        bạn đang xem trang thứ <i>{resultUsers.currentPage}</i> trong tổng số{" "}
        <i>{resultUsers.totalPages} trang</i>
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
      let alertLock = this.state.lockAccount ? (
        <SweetAlert
          success
          title="Khóa thành công!"
          onConfirm={() => {
            this.onCancelConfirm();
          }}
        ></SweetAlert>
      ) : (
        <></>
      );

      let alertUnlock = this.state.unlockAccount ? (
        <SweetAlert
          success
          title="Mở khóa thành công!"
          onConfirm={() => {
            this.onCancelConfirm();
          }}
        ></SweetAlert>
      ) : (
        <></>
      );
      return (
        <>
          {alertLock}
          {alertUnlock}
          <header
            className="page-header bg-img"
            style={{ backgroundImage: `url(${Banner})` }}
          >
            <div className="container page-name">
              <h1 className="text-center">
                Quản lý các người dùng trên hệ thống
              </h1>
              <p className="lead text-center">
                Lựa chọn các tiêu chí dưới đây để tìm người dùng
              </p>
            </div>

            <div className="container">
              <form action="#" onSubmit={(e) => this.onSubmit(e)}>
                <div className="row">
                  <div className="form-group col-xs-12 col-sm-2">
                    <label>Tên người dùng: </label>
                  </div>
                  <div className="form-group col-xs-12 col-sm-10">
                    <AutoCompleteText
                      name="user_name"
                      items={[]}
                      value={user_name}
                      getChildState={this.getChildState}
                      placeholder="Tên người dùng"
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
                  {errors.user_name && (
                    <div
                      className="invalid-feedback text-center"
                      style={{ color: "red" }}
                    >
                      {errors.user_name}
                    </div>
                  )}
                  {UserComp}
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

ManageUser.propTypes = {
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  searchUsers: PropTypes.func.isRequired,
  lockAccount: PropTypes.func.isRequired,
  unlockAccount: PropTypes.func.isRequired,
  changeState: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  errors: state.errors,
  user: state.user,
});

const mapDispatchToProps = {
  searchUsers,
  lockAccount,
  unlockAccount,
  changeState,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageUser);
