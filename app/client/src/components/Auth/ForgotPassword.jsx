import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextInputAuth from "../HOC/TextInputAuth";
import { forgotPassword } from "../../actions/auth.action";
import Logo from "../../assets/img/logo.png";
import SweetAlert from "react-bootstrap-sweetalert";

class ForgotPassword extends Component {
  static propTypes = {
    forgotPassword: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      user_name: "",
      newPassword: "",
      newPassword2: "",
      errors: {},
      forgotSuccess: false,
    };
  }
  componentWillReceiveProps(nextPops) {
    if (nextPops.errors) {
      this.setState({ errors: nextPops.errors });
    }
  }

  onConfirm() {
    this.setState({
      ...this.state,
      forgotSuccess: false,
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    const { user_name, newPassword, newPassword2 } = this.state;
    await this.props.forgotPassword({user_name: user_name, newPassword: newPassword, newPassword2: newPassword2});

    this.setState({
      ...this.state,
      forgotSuccess: this.props.auth.forgotSuccess,
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { user_name, newPassword, newPassword2, errors } = this.state;
    let alertSucc = !this.state.forgotSuccess ? (
      <></>
    ) : (
      <SweetAlert
        success
        title="Thay mật khẩu thành công!"
        onConfirm={() => {
          this.onConfirm();
        }}
      ></SweetAlert>
    );
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
                    <i className="ti-unlock"></i>
                  </span>
                  <TextInputAuth
                    id="user_name"
                    name="user_name"
                    className="form-control form-control-lg fs-13 px-3 rounded"
                    placeholder="Nhập username"
                    title="Nhập username"
                    type="text"
                    onChange={(e) => this.onChange(e)}
                    value={user_name}
                    error={errors.user_name}
                  />
                </div>
              </div>

              <hr className="hr-xs" />

              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="ti-unlock"></i>
                  </span>
                  <TextInputAuth
                    id="newPassword"
                    name="newPassword"
                    className="form-control form-control-lg fs-13 px-3 rounded"
                    placeholder="Nhập mật khẩu mới"
                    title="Nhập mật khẩu mới"
                    type="password"
                    onChange={(e) => this.onChange(e)}
                    value={newPassword}
                    error={errors.newPassword}
                  />
                </div>
              </div>

              <hr className="hr-xs" />

              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="ti-unlock"></i>
                  </span>
                  <TextInputAuth
                    id="newPassword2"
                    name="newPassword2"
                    className="form-control form-control-lg fs-13 px-3 rounded"
                    placeholder="Nhập lại mật khẩu mới"
                    title="Nhập lại mật khẩu mới"
                    type="password"
                    onChange={(e) => this.onChange(e)}
                    value={newPassword2}
                    error={errors.newPassword2}
                  />
                </div>
              </div>

              <button className="btn btn-primary btn-block" type="submit">
              Reset mật khẩu
              </button>
            </form>
          </div>

          <div className="login-links">
            <p className="text-center">
              <Link to="/login">Quay về trang đăng nhập</Link>
            </p>
          </div>
        </main>
        {alertSucc}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

const mapDispatchToProps = { forgotPassword };

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
