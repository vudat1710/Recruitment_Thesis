import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/auth.action";
import Logo from "../../assets/img/logo.png";
import UserLogo from "../../assets/img/logo_user.png";
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
  onLogoutClick(e) {
    e.preventDefault();
    // this.props.clearCurrentProfile();
    this.props.logoutUser();
  }
  render() {
    const { isShow } = this.state;
    const { isAuthenticated, user } = this.props.auth;
    const PullRightAuth = !isAuthenticated ? (
      <div className="dropdown" style={userLoginA}>
        <div className="dropdown-content">
          <Link className="links" style={userLoginA} to="/register">
            Đăng ký
          </Link>
          <Link className="links" to="/login">
            Đăng nhập
          </Link>{" "}
        </div>
      </div>
    ) : (
      <div className="dropdown">
        <div className="dropdown-content">
          <Link className="links" to="/updateUser">
            Cập nhật thông tin cá nhân
          </Link>
          <Link className="links" to="/changePassword">
            Đổi mật khẩu
          </Link>

          <a className="links" onClick={(e) => this.onLogoutClick(e)}>
            Đăng xuất
          </a>
        </div>
      </div>
    );

    return (
      <nav className="header">
        <Link className="links logo" to="/">
          <img src={Logo} alt="logo" />
        </Link>
        {PullRightAuth}
        <div class="rightSection">
          <Link className="links" to="/">
            Trang chủ
          </Link>
          <Link className="links" to="/wishlist">
            Danh sách yêu thích
          </Link>
          <Link className="links" to="/updateUser">
            Cài đặt gợi ý việc làm
          </Link>
          <Link className="links" to="/compare">
            So sánh việc làm
          </Link>
          <Link className="links" to="/stats">
            Xem thống kê
          </Link>
        </div>
        <div
          style={{
            backgroundImage:
              "url(" +
              "https://i.postimg.cc/ZnHTP71s/aircraft-airplane-boat-1575833.jpg" +
              ")",
          }}
          class="page-holder bg-cover"
        />
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
