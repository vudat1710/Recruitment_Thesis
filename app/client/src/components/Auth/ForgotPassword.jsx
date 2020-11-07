import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextInputAuth from "../HOC/TextInputAuth";
import { forgetPassword } from "../../actions/auth.action";
import Logo from '../../assets/img/logo.png';

class ForgotPassword extends Component {
  static propTypes = {
    forgetPassword: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      errors: {},
      forgetSuccess: false,
    };
  }
  componentWillReceiveProps(nextPops) {
    if (nextPops.auth.forgetSuccess) {
      this.setState({
        ...this.state,
        forgetSuccess: true,
      });
    }
    if (nextPops.errors) {
      this.setState({ errors: nextPops.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const email = this.state.email;
    this.props.forgetPassword(email);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { email, errors, forgetSuccess } = this.state;
    // let Content = !forgetSuccess ? (
    //   <form id="loginForm" noValidate onSubmit={(e) => this.onSubmit(e)}>
    //     <hr className="border-gray my-0" />
    //     <div className="px-5 py-3">
    //       <p className="text-center">
    //         Chào bạn <br />
    //         hãy nhập địa chỉ email để lấy lại mật khẩu
    //         <br />
    //         <span id="sp-message-login" />
    //       </p>
    //       <TextInputAuth
    //         id="email"
    //         name="email"
    //         className="form-control form-control-lg rounded"
    //         placeholder="Nhập email"
    //         title="Nhập email"
    //         type="input"
    //         onChange={(e) => this.onChange(e)}
    //         value={email}
    //         error={errors.email}
    //       />
    //       <button className="btn btn-lg btn-block btn-warning text-uppercase fs-13 rounded mt-5">
    //         Nhận mật khẩu mới
    //       </button>
    //     </div>
    //   </form>
    // ) : (
    //   <div className="px-5 py-3">
    //     <h6 className="text-center">
    //       Mật khẩu mới đã được gửi tới email của bạn
    //       <br />
    //       <span id="sp-message-login" />
    //     </h6>
    //     <div>
    //       <div className="text-center fs-15 p-3">
    //         Copy mật khẩu mới đã được gửi{" "}
    //         <div className="d-inline-block">
    //           Sau đó{" "}
    //           <Link className="text-primary" to="/login">
    //             <ins style={{ color: "#ffc107", fontSize: "15px" }}>
    //               click vào đây để đăng nhập
    //             </ins>
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );
    return (
      <div className="login-page">
        <main>
          <div className="login-block">
            <img src={Logo} alt="" />
            <h1>Quên mật khẩu</h1>

            <form id="forgotForm" noValidate onSubmit={(e) => this.onSubmit(e)}>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="ti-email"></i>
                  </span>
                  <TextInputAuth
                    id="email"
                    name="email"
                    className="form-control form-control-lg rounded"
                    placeholder="Nhập email"
                    title="Nhập email"
                    type="input"
                    onChange={(e) => this.onChange(e)}
                    value={email}
                    error={errors.email}
                  />
                </div>
              </div>

              <button className="btn btn-primary btn-block" type="submit">
                Request reset link
              </button>
            </form>
          </div>

          <div className="login-links">
            <p className="text-center">
              <Link to="/login">Back to login</Link>
            </p>
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

const mapDispatchToProps = { forgetPassword };

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
