import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser } from "../../actions/auth.action";
import Logo from "../../assets/img/logo.png";
import TextInputAuth from "../HOC/TextInputAuth";
import { TextField } from "@material-ui/core";
import "./extra.scss";

class Register extends Component {
  static propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      user_name: "",
      gender: "",
      password: "",
      password2: "",
      year_of_birth: "1998-10-17",
      errors: {},
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    const {
      user_name,
      gender,
      year_of_birth,
      password2,
      password,
    } = this.state;
    const newUser = {
      user_name,
      gender,
      password2,
      password,
      year_of_birth,
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const {
      user_name,
      gender,
      password2,
      password,
      errors,
      year_of_birth,
    } = this.state;
    return (
      <div className="login-page">
        <main>
          <div className="login-block">
            <img src={Logo} alt="" />
            <h1>Đăng ký 1 tài khoản mới</h1>

            <form id="signupForm" noValidate onSubmit={(e) => this.onSubmit(e)}>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="ti-user"></i>
                  </span>
                  <TextInputAuth
                    id="user_name"
                    name="user_name"
                    className="form-control form-control-lg fs-13 px-3 rounded"
                    placeholder="Tên đăng nhập"
                    title="Tên đăng nhập"
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
                    <i className="ti-gender"></i>
                  </span>
                  <TextInputAuth
                    id="gender"
                    name="gender"
                    className="form-control form-control-lg fs-13 px-3 rounded"
                    placeholder="Giới tính"
                    title="Giới tính"
                    type="text"
                    onChange={(e) => this.onChange(e)}
                    value={gender}
                    error={errors.gender}
                  />
                </div>
              </div>

              <hr className="hr-xs" />

              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="ti-email"></i>
                  </span>
                  <TextField
                    id="date"
                    type="date"
                    name="year_of_birth"
                    defaultValue="1998-10-17"
                    label="Ngày sinh"
                    className="aa"
                    style = {{width: 250, fontSize: 200}}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => this.onChange(e)}
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
                    id="password"
                    name="password"
                    className="form-control form-control-lg fs-13 px-3 rounded"
                    placeholder="Nhập mật khẩu"
                    title="Nhập mật khẩu"
                    type="password"
                    onChange={(e) => this.onChange(e)}
                    value={password}
                    error={errors.password}
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
                    id="password2"
                    name="password2"
                    className="form-control form-control-lg fs-13 px-3 rounded"
                    placeholder="Nhập lại mật khẩu"
                    title="Nhập lại mật khẩu"
                    type="password"
                    onChange={(e) => this.onChange(e)}
                    value={password2}
                    error={errors.password2}
                  />
                </div>
              </div>

              <button className="btn btn-primary btn-block" type="submit">
                Đăng ký
              </button>

              {/* <div className="login-footer">
                <h6>Hoặc đăng ký bằng</h6>
                <ul className="social-icons">
                  <li>
                    <a className="facebook" href="#">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                </ul>
              </div> */}
            </form>
          </div>

          <div className="login-links">
            <p className="text-center">
              Đã có 1 tài khoản trên hệ thống?{" "}
              <Link className="txt-brand" to="/login">
                Đăng nhập
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth, // lấy auth của thằng authReducer trong /reducers/index
  errors: state.errors,
});

const mapDispatchToProps = {
  registerUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
