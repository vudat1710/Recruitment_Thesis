import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Logo from "../../assets/img/logo.png";
import UserLogo from "../../assets/img/logo_user.png";
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
              <Link className="active" to="/">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link className="active" to="/wishlist">
                Danh sách yêu thích
              </Link>
            </li>
            <li>
              <Link className="active" to="/updateUser">
                Cài đặt gợi ý việc làm
              </Link>
            </li>
            <li>
              <Link className="active" to="/compare">
                So sánh việc làm
              </Link>
            </li>
            {/* <li>
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
            </li> */}
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

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
