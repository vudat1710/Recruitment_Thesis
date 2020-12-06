import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUser, getUserByUserId } from "../../actions/user.action";
import { getDataAutoComplete } from "../../actions/post.action";
import AutoGenTag from "../common/AutoGenTag";
import Notifications, { notify } from "react-notify-toast";
import { experienceDict } from "../../utils/utils";
import SweetAlert from "react-bootstrap-sweetalert";

class UpdateInfo extends Component {
  toast = notify.createShowQueue();
  constructor(props) {
    super(props);

    this.state = {
      userName: localStorage.userName,
      experience: "",
      qualification: "",
      yearOfBirth: "",
      gender: "",
      jobType: "",
      salary: "",
      workplaces: [],
      majors: [],
      isLoading: true,
      dataAuto: null,
    };
  }
  async componentDidMount() {
    await this.props.getDataAutoComplete();
    await this.props.getUserByUserId(localStorage.userId);

    this.setState({
      ...this.state,
      dataAuto: this.props.posts.autoComplete,
      experience: this.props.user.user.experience,
      qualification: this.props.user.user.qualification,
      yearOfBirth: this.props.user.user.year_of_birth,
      gender: this.props.user.user.gender,
      jobType: this.props.user.user.job_type,
      salary: this.props.user.user.salary,
      workplaces: this.props.user.user.WorkPlaces.map((a) => a.name),
      majors: this.props.user.user.Majors.map((a) => a.name),
      isLoading: false,
      success: false,
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    e.preventDefault();
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    });
  }

  getChildState = (data) => {
    if (data.name === "workplaces") {
      this.setState({
        ...this.state,
        workplaces: data.data,
      });
    } else if (data.name === "majors") {
      this.setState({
        ...this.state,
        majors: data.data,
      });
    }
  };

  async onSubmit(e) {
    e.preventDefault();
    const {
      userName,
      experience,
      qualification,
      jobType,
      salary,
      workplaces,
      majors,
    } = this.state;
    const newInfo = {
      user_name: userName,
      experience: experience,
      qualification: qualification,
      job_type: jobType,
      salary: salary,
      workplaces: workplaces,
      majors: majors,
    };
    await this.props.updateUser(newInfo);
    this.setState({
      ...this.state,
      success: this.props.user.success,
    });
  }

  onConfirm() {
    this.setState({
      ...this.state,
      success: false,
    });
  }

  render() {
    let {
      experience,
      qualification,
      jobType,
      salary,
      workplaces,
      majors,
      isLoading,
      dataAuto,
    } = this.state;

    let alertSucc = !this.state.success ? (
      <></>
    ) : (
      <SweetAlert
        success
        title="Thay đổi thông tin cá nhân thành công!"
        onConfirm={() => {
          this.onConfirm();
        }}
      ></SweetAlert>
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
      experience = experience ? experience : "1";
      jobType = jobType ? jobType : "Toàn thời gian";
      salary = salary ? salary : "Tất cả mức lương";
      qualification = qualification ? qualification : "Không yêu cầu";

      const age =
        parseInt(new Date().getFullYear()) -
        parseInt(this.state.yearOfBirth.split("-")[0]);
      return (
        <form action="#" onSubmit={(e) => this.onSubmit(e)}>
          {alertSucc}
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
                      value={this.state.userName}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label>Giới tính: </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Gender"
                      value={this.state.gender}
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label>Năm sinh: </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Year of birth"
                      value={this.state.yearOfBirth}
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
                        <select
                          className="form-control"
                          name="experience"
                          onClick={(e) => this.onChange(e)}
                        >
                          <option defaultValue>
                            {experienceDict[experience]}
                          </option>
                          {dataAuto.experience.map((ex) => {
                            if (ex !== experience)
                              return (
                                <option value={ex}>{experienceDict[ex]}</option>
                              );
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <label>Hình thức làm việc: </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-clock-o"></i>
                        </span>
                        <select
                          className="form-control"
                          name="jobType"
                          onClick={(e) => this.onChange(e)}
                        >
                          <option defaultValue>{jobType}</option>
                          {dataAuto.jobTypes.map((jT) => {
                            if (jT !== jobType)
                              return <option value={jT}>{jT}</option>;
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <label>Mức lương cơ bản: </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-usd"></i>
                        </span>
                        <select
                          className="form-control"
                          name="salary"
                          onClick={(e) => this.onChange(e)}
                        >
                          <option defaultValue>{salary}</option>
                          {dataAuto.salary_types.map((s) => {
                            if (s !== salary)
                              return <option value={s}>{s}</option>;
                          })}
                        </select>
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
                        <select
                          className="form-control"
                          name="qualification"
                          onClick={(e) => this.onChange(e)}
                        >
                          <option defaultValue>{qualification}</option>
                          {dataAuto.qualifications.map((qual) => {
                            if (qual !== qualification)
                              return <option value={qual}>{qual}</option>;
                          })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <hr className="hr-lg" />

                  <h5>Ngành nghề mong muốn</h5>
                  <div className="form-group">
                    <AutoGenTag
                      name="majors"
                      items={dataAuto.majors}
                      value={majors}
                      getChildState={this.getChildState}
                      placeholder="Ngành nghề mong muốn"
                    />
                    <span className="help-block">
                      Viết và lựa chọn trong danh sách gợi ý
                    </span>
                  </div>

                  <hr className="hr-lg" />

                  <h5>Địa điểm làm việc mong muốn</h5>
                  <div className="form-group">
                    <AutoGenTag
                      name="workplaces"
                      items={dataAuto.workplaces}
                      value={workplaces}
                      getChildState={this.getChildState}
                      placeholder="Địa điểm làm việc mong muốn"
                    />
                    <span className="help-block">
                      Viết và lựa chọn trong danh sách gợi ý
                    </span>
                  </div>
                </div>
              </div>

              <div className="button-group">
                <div className="action-buttons">
                  <div className="upload-button">
                    <button className="btn btn-block btn-primary">
                      Thay đổi thông tin cá nhân
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div style={{ height: 100 }}></div>
        </form>
      );
    }
  }
}

UpdateInfo.propTypes = {
  user: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  updateUser: PropTypes.func.isRequired,
  getDataAutoComplete: PropTypes.func.isRequired,
  getUserByUserId: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  errors: state.errors,
  posts: state.posts,
});

const mapDispatchToProps = { updateUser, getDataAutoComplete, getUserByUserId };

export default connect(mapStateToProps, mapDispatchToProps)(UpdateInfo);
