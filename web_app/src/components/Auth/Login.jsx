import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import TextInputAuth from '../HOC/TextInputAuth';
import Logo from '../../assets/img/logo.png';
import { loginUser } from "../../actions/auth.action";

class Login extends Component {
  static propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  UNSAFE_componentWillReceiveProps(nextPops) {
    if (nextPops.auth.isAuthenticated) {
      this.props.history.push("/");
    }
    if (nextPops.errors) {
      this.setState({ errors: nextPops.errors });
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(userData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { email, password, errors } = this.state;
    return (
      <div className="login-page">
        <main>
          <div className="login-block">
            <img src={Logo} alt="" />
            <h1>Đăng nhập</h1>

            <form 
                id="loginForm"
                noValidate
                onSubmit={e => this.onSubmit(e)}
            >
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="ti-email"></i>
                  </span>
                  <TextInputAuth
                      id="email"
                      name="email"
                      className="form-control"
                      placeholder="Nhập email"
                      title="Nhập email"
                      type="input"
                      onChange={e => this.onChange(e)}
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
                      onChange={e => this.onChange(e)}
                      value={password}
                      error={errors.login}
                    />
                </div>
              </div>

              <button className="btn btn-primary btn-block" type="submit">
                Đăng nhập
              </button>

              <div className="login-footer">
                <h6>Đăng nhập bằng</h6>
                <ul className="social-icons">
                  <li>
                    <a className="facebook" href="#">
                      <i className="fa fa-facebook"></i>
                    </a>
                  </li>
                  {/* <li><a className="twitter" href="#"><i className="fa fa-twitter"></i></a></li>
                  <li><a className="linkedin" href="#"><i className="fa fa-linkedin"></i></a></li> */}
                </ul>
              </div>
            </form>
          </div>

          <div className="login-links">
            <Link className="pull-left" to="/forgotPassword">
                Quên mật khẩu?
            </Link>
            <Link className="pull-right" to="/register">
                Đăng ký tài khoản mới
            </Link>
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

const mapDispatchToProps = { loginUser };

export default connect(mapStateToProps, mapDispatchToProps)(Login);
