import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  lockAccount,
  unlockAccount,
  getUserByUserId,
  changeState
} from "../../actions/user.action";
import { experienceDict } from "../../utils/utils";
import SweetAlert from "react-bootstrap-sweetalert";

class UserDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: 0,
      userDetails: {},
      isLoading: true,
      lockAccount: false,
      unlockAccount: false,
      type: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextPops) {
    if (nextPops.errors) {
      this.setState({ errors: nextPops.errors });
    }
  }

  async componentDidMount() {
    await this.props.getUserByUserId({ userId: this.props.match.params.id });

    this.setState({
      ...this.state,
      userId: this.props.match.params.id,
      userDetails: this.props.user.userDetails,
      isLoading: false,
    });
  }

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
    await this.props.changeState({type: this.state.type})
    
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

  render() {
    let { userDetails, isLoading, errors } = this.state;

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

    if (isLoading) {
      return (
        <div className="spinner">
          <span className="dot1"></span>
          <span className="dot2"></span>
          <span className="dot3"></span>
        </div>
      );
    } else {
      
      const age =
        parseInt(new Date().getFullYear()) -
        parseInt(userDetails.year_of_birth.split("-")[0]);
      return (
        <div className="container">
          {alertLock}
          {alertUnlock}
          <header className="page-header">
            <div className="container page-name">
              <h1 className="text-center">Thông tin cá nhân</h1>
              <p className="lead text-center">
                Thay đổi thông tin cá nhân để được gợi ý tốt nhất.
              </p>
            </div>

            <div className="container">
              <div className="row">
                {/* <div className="col-xs-12 col-sm-4">
                      <div className="form-group">
                        <input type="file" className="dropify" data-default-file="assets/img/avatar.jpg"/>
                        <span className="help-block">Please choose a 4:6 profile picture.</span>
                      </div>
                    </div> */}

                <div className="col-xs-12 col-sm-12">
                  <div className="form-group">
                    <label>Tên tài khoản: </label>
                    <input
                      type="text"
                      className="form-control input-lg"
                      placeholder="Username"
                      value={userDetails.user_name}
                      readOnly
                    />
                    {errors.user_name && (
                      <div
                        className="invalid-feedback"
                        style={{ color: "red" }}
                      >
                        {errors.user_name}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Giới tính: </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Gender"
                      value={userDetails.gender}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label>Năm sinh: </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Year of birth"
                      value={userDetails.year_of_birth}
                      readOnly
                    />
                  </div>

                  <hr className="hr-lg" />

                  <h5>Thông tin cơ bản</h5>
                  <div className="row">
                    <div className="form-group col-xs-12 col-sm-6">
                      <label>Kinh nghiệm: </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-flask"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          value={experienceDict[userDetails.experience]}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <label>Hình thức làm việc: </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-clock-o"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          value={userDetails.job_type}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <label>Mức lương cơ bản: </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-usd"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          value={userDetails.salary}
                          readOnly
                        />
                        <span className="input-group-addon">/ tháng</span>
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <label>Tuổi: </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-birthday-cake"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Age"
                          value={age}
                          readOnly
                        />
                        <span className="input-group-addon">tuổi</span>
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <label>Bằng cấp: </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-briefcase"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          value={userDetails.qualification}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="hr-lg" />

                  <h5>Ngành nghề mong muốn</h5>
                  <div className="form-group">
                    {userDetails.Majors.map((a) => a.name).map((item) => (
                      <span className="tag label label-info">{item}</span>
                    ))}
                  </div>

                  <hr className="hr-lg" />

                  <h5>Địa điểm làm việc mong muốn</h5>
                  <div className="form-group">
                    {userDetails.WorkPlaces.map((a) => a.name).map((item) => (
                      <span className="tag label label-info">{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="button-group">
                <div className="action-buttons">
                  <div className="upload-button">
                    <a
                      className="btn btn-block btn-danger"
                      onClick={() => this.onLockClick(userDetails.userId)}
                    >
                      Khóa
                    </a>
                  </div>
                  <div className="upload-button">
                    <a
                      className="btn btn-block btn-primary"
                      onClick={() => this.onUnlockClick(userDetails.userId)}
                    >
                      Mở khóa
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div style={{ height: 100 }}></div>
        </div>
      );
    }
  }
}

UserDetails.propTypes = {
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  lockAccount: PropTypes.func.isRequired,
  unlockAccount: PropTypes.func.isRequired,
  getUserByUserId: PropTypes.func.isRequired,
  changeState: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  errors: state.errors
});

const mapDispatchToProps = { lockAccount, unlockAccount, getUserByUserId, changeState };

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);
