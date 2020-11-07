import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { registerUser } from "../../actions/auth.action";
import Logo from '../../assets/img/logo.png';
import TextInputAuth from "../HOC/TextInputAuth";

class Register extends Component {
  static propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      fullname: "",
      email: "",
      password: "",
      password2: "",
      province: "HANOI",
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
    const { fullname, email, password2, password } = this.state;
    const newUser = {
      fullname,
      email,
      password2,
      password,
    };

    this.props.registerUser(newUser, this.props.history);
  }

  render() {
    const { fullname, email, password2, password, errors } = this.state;
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
                    id="fullname"
                    name="fullname"
                    className="form-control form-control-lg fs-13 px-3 rounded"
                    placeholder="Họ và tên"
                    title="Họ và tên"
                    type="text"
                    onChange={(e) => this.onChange(e)}
                    value={fullname}
                    error={errors.fullname}
                  />
                </div>
              </div>

              <hr className="hr-xs" />

              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="ti-email"></i>
                  </span>
                  <TextInputAuth
                    id="email"
                    name="email"
                    className="form-control form-control-lg fs-13 px-3 rounded"
                    placeholder="Email"
                    title="Email"
                    type="text"
                    onChange={(e) => this.onChange(e)}
                    value={email}
                    error={errors.email}
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

              <div className="login-footer">
                <h6>Hoặc đăng ký bằng</h6>
                <ul className="social-icons">
                  <li>
                    <a className="facebook" href="#">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                </ul>
              </div>
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
