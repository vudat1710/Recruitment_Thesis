import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/auth.action";
import Logo from "../../assets/img/logo.png";
import classnames from "classnames";

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
  onLogoutClick(e) {
    e.preventDefault();
    // this.props.clearCurrentProfile();
    this.props.logoutUser();
  }
  render() {
    const { isShow } = this.state;
    const { isAuthenticated, user } = this.props.auth;
    const PullRightAuth = !isAuthenticated ? (
      <div className="pull-right user-login" style={userLoginA}>
        <Link className="btn btn-sm btn-primary" to="/login">
          Đăng nhập
        </Link>{" "}
        hoặc{" "}
        <Link style={userLoginA} to="/register">
          đăng ký
        </Link>
      </div>
    ) : (
      <div className="pull-right">
        <div className="dropdown user-account">
          <a className="dropdown-toggle" href="#" data-toggle="dropdown">
            <img src="assets/img/logo-envato.png" alt="avatar" />
          </a>

          <ul className="dropdown-menu dropdown-menu-right">
            <li>
              <Link to="/login">Đăng nhập</Link>
            </li>
            <li>
              <Link to="/register">Đăng ký</Link>
            </li>
            <li>
              <Link to="/forgotPassword">Quên mật khẩu</Link>
            </li>
            <li>
              <a onClick={(e) => this.onLogoutClick(e)}>Đăng xuất</a>
            </li>
          </ul>
        </div>
      </div>
    );

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

          {PullRightAuth}

          <ul className="nav-menu">
            <li>
              <Link className="active" to="/">
                Trang chủ
              </Link>
              <ul>
                <li>
                  <a className="active" href="index.html">
                    Version 1
                  </a>
                </li>
                <li>
                  <a href="index-2.html">Version 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">Position</a>
              <ul>
                <li>
                  <a href="job-list-1.html">Browse jobs - 1</a>
                </li>
                <li>
                  <a href="job-list-2.html">Browse jobs - 2</a>
                </li>
                <li>
                  <a href="job-list-3.html">Browse jobs - 3</a>
                </li>
                <li>
                  <a href="job-detail.html">Job detail</a>
                </li>
                <li>
                  <a href="job-apply.html">Apply for job</a>
                </li>
                <li>
                  <a href="job-add.html">Post a job</a>
                </li>
                <li>
                  <a href="job-manage.html">Manage jobs</a>
                </li>
                <li>
                  <a href="job-candidates.html">Candidates</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">Resume</a>
              <ul>
                <li>
                  <a href="resume-list.html">Browse resumes</a>
                </li>
                <li>
                  <a href="resume-detail.html">Resume detail</a>
                </li>
                <li>
                  <a href="resume-add.html">Create a resume</a>
                </li>
                <li>
                  <a href="resume-manage.html">Manage resumes</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">Company</a>
              <ul>
                <li>
                  <a href="company-list.html">Browse companies</a>
                </li>
                <li>
                  <a href="company-detail.html">Company detail</a>
                </li>
                <li>
                  <a href="company-add.html">Create a company</a>
                </li>
                <li>
                  <a href="company-manage.html">Manage companies</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="#">Pages</a>
              <ul>
                <li>
                  <a href="page-blog.html">Blog</a>
                </li>
                <li>
                  <a href="page-post.html">Blog-post</a>
                </li>
                <li>
                  <a href="page-about.html">About</a>
                </li>
                <li>
                  <a href="page-contact.html">Contact</a>
                </li>
                <li>
                  <a href="page-faq.html">FAQ</a>
                </li>
                <li>
                  <a href="page-pricing.html">Pricing</a>
                </li>
                <li>
                  <a href="page-typography.html">Typography</a>
                </li>
                <li>
                  <a href="page-ui-elements.html">UI elements</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

// export default Header;
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

const mapDispatchToProps = { logoutUser };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
