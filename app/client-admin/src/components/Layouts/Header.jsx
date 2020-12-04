import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Logo from "../../assets/img/logo.png";
import UserLogo from "../../assets/img/logo_user.png";
import classnames from "classnames";
import "./Header.scss";

const userLoginA = {
  color: "#7e8890",
};

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
    };
  }

  render() {
    const { isShow } = this.state;

    return (
      <nav className="navbar" style={{ backgroundColor: "#e5e7ed" }}>
        <div className="container">
          <div className="pull-left">
            <a className="navbar-toggle" href="#" data-toggle="offcanvas">
              <i className="ti-menu"></i>
            </a>

            <div className="logo-wrapper">
              <Link className="logo" to="/">
                <img src={Logo} alt="logo" />
              </Link>
              <Link className="logo-alt" to="/">
                <img src={Logo} alt="logo-alt" />
              </Link>
            </div>
          </div>

          <ul className="nav-menu">
            <li>
              <Link className="active" to="/managePost">
                Quản lý bài đăng
              </Link>
            </li>
            <li>
              <Link className="active" to="/manageCompany">
                Quản lý công ty
              </Link>
            </li>
            <li>
              <Link className="active" to="/manageMajor">
                Quản lý ngành nghề
              </Link>
            </li>
            <li>
              <Link className="active" to="/manageWorkPlace">
                Quản lý địa điểm làm việc
              </Link>
            </li>
            <li>
              <Link className="active" to="/manageUser">
                Quản lý người dùng
              </Link>
            </li>
            <li>
              <Link className="active" to="/manageComment">
                Quản lý bình luận
              </Link>
            </li>
            <li>
              <Link className="active" to="/stats">
                Xem thống kê
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

// export default Header;
const mapStateToProps = (state) => ({
  errors: state.errors,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
