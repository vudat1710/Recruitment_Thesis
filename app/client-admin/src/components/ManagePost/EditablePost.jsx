import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TextInputAuth from "../HOC/TextInputAuth";
import {
  getDataAutoComplete,
  getPostById,
  updatePost,
  addPost,
} from "../../actions/post.action";
import AutoGenTag from "../common/AutoGenTag";
import { experienceDict } from "../../utils/utils";
import SweetAlert from "react-bootstrap-sweetalert";

class EditablePost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      postId: 0,
      type: this.props.location.pathname,
      dataAuto: null,
      isLoading: true,
      postUpdate: false,
      postAdd: false,
      title: "",
      gender: "Không yêu cầu",
      experience: "0",
      salary_type: "5-7 triệu",
      job_type: "Toàn thời gian",
      qualification: "Đại học",
      workplaces: [],
      majors: [],
      name: "",
      description: "",
      job_benefits: "",
      valid_through: "2021-12-31",
      extra_requirements: "",
      address: "",
      img_url: "",
      errors: {},
    };

    this.onImageChange = this.onImageChange.bind(this);
  }

  componentWillReceiveProps(nextPops) {
    if (nextPops.errors) {
      this.setState({ errors: nextPops.errors });
    }
  }

  onImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      this.setState({
        img_url: URL.createObjectURL(img),
      });
    }
  }

  async componentDidMount() {
    await this.props.getDataAutoComplete();
    if (this.state.type !== "/addPost") {
      await this.props.getPostById(this.props.match.params.id);

      this.setState({
        ...this.state,
        postId: this.props.match.params.id,
        dataAuto: this.props.posts.autoComplete,
        title: this.props.posts.postDetails.title,
        gender: this.props.posts.postDetails.gender,
        experience: this.props.posts.postDetails.experience,
        salary_type: this.props.posts.postDetails.salary_type,
        job_type: this.props.posts.postDetails.job_type,
        qualification: this.props.posts.postDetails.qualification,
        workplaces: this.props.posts.postDetails.WorkPlaces.map((a) => a.name),
        majors: this.props.posts.postDetails.Majors.map((a) => a.name),
        name: this.props.posts.postDetails.Companies[0].name,
        description: this.props.posts.postDetails.description,
        job_benefits: this.props.posts.postDetails.job_benefits,
        extra_requirements: this.props.posts.postDetails.extra_requirements,
        img_url: this.props.posts.postDetails.Companies[0].img_url,
        address: this.props.posts.postDetails.address,
        valid_through: this.props.posts.postDetails.valid_through,
        isLoading: false,
      });
    } else {
      this.setState({
        ...this.state,
        dataAuto: this.props.posts.autoComplete,
        isLoading: false,
      });
    }
  }

  onChange(e) {
    this.setState({
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
      title,
      gender,
      experience,
      salary_type,
      job_type,
      qualification,
      majors,
      workplaces,
      img_url,
      description,
      job_benefits,
      extra_requirements,
      name,
      address,
      valid_through,
      type,
    } = this.state;
    let min_value = 0,
      max_value = 0;
    if (salary_type !== "Thỏa thuận") {
      const l = [...salary_type.matchAll(/\d+/g)].map((a) => a[0]);
      min_value = parseInt(l[0]);
      if (l.length === 1) {
        max_value = parseInt(l[0]);
      } else {
        max_value = parseInt(l[1]);
      }
    }
    const newInfo = {
      title: title,
      gender: gender,
      experience: experience,
      qualification: qualification,
      job_type: job_type,
      salary_type: salary_type,
      workplaces: workplaces,
      majors: majors,
      img_url: img_url,
      description: description,
      job_benefits: job_benefits,
      extra_requirements: extra_requirements,
      name: name,
      address: address,
      min_value: min_value,
      max_value: max_value,
      valid_through: valid_through,
      company_address: address
    };
    if (type !== "/addPost") {
      newInfo["postId"] = this.props.match.params.id;
      await this.props.updatePost(newInfo);
      this.setState({
        ...this.state,
        postUpdate: this.props.posts.postUpdate,
      });
    } else {
      newInfo["is_deleted"] = 0;
      await this.props.addPost(newInfo);
      this.setState({
        ...this.state,
        postAdd: this.props.posts.postAdd,
      });
    }
  }

  onConfirm() {
    if (this.state.type !== "/addPost") {
      this.setState({
        ...this.state,
        postUpdate: false,
      });
    } else {
      this.setState({
        ...this.state,
        postAdd: false,
      });
    }
    window.location.href = "/managePost";
  }

  render() {
    let {
      title,
      gender,
      experience,
      salary_type,
      job_type,
      qualification,
      majors,
      workplaces,
      img_url,
      description,
      job_benefits,
      extra_requirements,
      name,
      address,
      valid_through,
      isLoading,
      dataAuto,
      errors,
    } = this.state;

    let alertSucc = !this.state.postUpdate ? (
      <></>
    ) : (
      <SweetAlert
        success
        title="Cập nhật thông tin thành công!"
        onConfirm={() => {
          this.onConfirm();
        }}
      ></SweetAlert>
    );

    let alertAddSucc = !this.state.postAdd ? (
      <></>
    ) : (
      <SweetAlert
        success
        title="Cập nhật thông tin thành công!"
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
      return (
        <form action="#" onSubmit={(e) => this.onSubmit(e)}>
          {/* <form action="#"> */}
          {alertSucc}
          {alertAddSucc}
          <header className="page-header">
            <div className="container page-name">
              <h1 className="text-center">Chỉnh sửa (hoặc thêm) bài đăng</h1>
              <p className="lead text-center">
                Chỉnh sửa (hoặc thêm) bài đăng theo ý muốn dành cho quản trị
                viên.
              </p>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-3">
                  <div className="form-group">
                    <img
                      src={img_url}
                      style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "block",
                      }}
                    />
                    <p className="lead text-center">Lựa chọn hình ảnh</p>
                    <input
                      type="file"
                      name="myImage"
                      onChange={(e) => this.onImageChange(e)}
                    />
                  </div>
                </div>

                <div className="col-xs-12 col-sm-9">
                  <div className="form-group">
                    <label>Title: </label>
                    <TextInputAuth
                      id="title"
                      type="text"
                      name="title"
                      className="form-control form-control-lg fs-13 px-3 rounded"
                      placeholder="title"
                      value={title}
                      onChange={(e) => this.onChange(e)}
                      error={errors.title}
                    />
                  </div>

                  <div className="form-group">
                    <label>Giới tính: </label>
                    <select
                      className="form-control"
                      name="gender"
                      onClick={(e) => this.onChange(e)}
                    >
                      <option defaultValue>{gender}</option>
                      {["Không yêu cầu", "Nam", "Nữ"].map((gd) => {
                        if (gd !== gender)
                          return <option value={gd}>{gd}</option>;
                      })}
                    </select>
                  </div>

                  <label>Hạn nộp hồ sơ:{"\t\t\t\t\t\t"} </label>
                  <div className="form-group">
                    <TextField
                      id="date"
                      type="date"
                      name="valid_through"
                      defaultValue={valid_through}
                      // label="Hạn nộp hồ sơ"
                      style={{ width: 250, fontSize: 500 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => this.onChange(e)}
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
                          name="job_type"
                          onClick={(e) => this.onChange(e)}
                        >
                          <option defaultValue>{job_type}</option>
                          {dataAuto.jobTypes.map((jT) => {
                            if (jT !== job_type)
                              return <option value={jT}>{jT}</option>;
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <label>Công ty: </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-building"></i>
                        </span>
                        <TextInputAuth
                          id="name"
                          type="text"
                          name="name"
                          className="form-control form-control-lg fs-13 px-3 rounded"
                          placeholder="name"
                          value={name}
                          onChange={(e) => this.onChange(e)}
                          error={errors.name}
                        />
                      </div>
                    </div>

                    <div className="form-group col-xs-12 col-sm-6">
                      <label>Địa chỉ: </label>
                      <div className="input-group input-group-sm">
                        <span className="input-group-addon">
                          <i className="fa fa-map-marker"></i>
                        </span>
                        <TextInputAuth
                          id="address"
                          type="text"
                          name="address"
                          className="form-control form-control-lg fs-13 px-3 rounded"
                          placeholder="address"
                          value={address}
                          onChange={(e) => this.onChange(e)}
                          error={errors.address}
                        />
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
                          name="salary_type"
                          onClick={(e) => this.onChange(e)}
                        >
                          <option defaultValue>{salary_type}</option>
                          {dataAuto.salary_types.map((s) => {
                            if (s !== salary_type)
                              return <option value={s}>{s}</option>;
                          })}
                        </select>
                        <span className="input-group-addon">/ tháng</span>
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

                  <h5>Ngành nghề</h5>
                  <div className="form-group">
                    <AutoGenTag
                      name="majors"
                      items={dataAuto.majors}
                      value={majors}
                      getChildState={this.getChildState}
                      placeholder="Ngành nghề"
                    />
                    <span className="help-block">
                      Viết và lựa chọn trong danh sách gợi ý
                    </span>
                    {errors.majors && (
                      <div
                        className="invalid-feedback"
                        style={{ color: "red" }}
                      >
                        {errors.majors}
                      </div>
                    )}
                  </div>

                  <hr className="hr-lg" />

                  <h5>Địa điểm làm việc</h5>
                  <div className="form-group">
                    <AutoGenTag
                      name="workplaces"
                      items={dataAuto.workplaces}
                      value={workplaces}
                      getChildState={this.getChildState}
                      placeholder="Địa điểm làm việc"
                    />
                    <span className="help-block">
                      Viết và lựa chọn trong danh sách gợi ý
                    </span>
                    {errors.workplaces && (
                      <div
                        className="invalid-feedback"
                        style={{ color: "red" }}
                      >
                        {errors.workplaces}
                      </div>
                    )}
                  </div>

                  <h5>Mô tả công việc</h5>
                  <div className="form-group">
                    <textarea
                      name="description"
                      className="summernote-editor"
                      style={{ width: "100%", height: 200 }}
                      onChange={(e) => this.onChange(e)}
                    >
                      {description}
                    </textarea>
                    {errors.description && (
                      <div
                        className="invalid-feedback"
                        style={{ color: "red" }}
                      >
                        {errors.description}
                      </div>
                    )}
                  </div>

                  <h5>Quyền lợi được hưởng</h5>
                  <div className="form-group">
                    <textarea
                      name="job_benefits"
                      className="summernote-editor"
                      style={{ width: "100%", height: 200 }}
                      onChange={(e) => this.onChange(e)}
                    >
                      {job_benefits}
                    </textarea>
                    {errors.job_benefits && (
                      <div
                        className="invalid-feedback"
                        style={{ color: "red" }}
                      >
                        {errors.job_benefits}
                      </div>
                    )}
                  </div>

                  <h5>Yêu cầu bổ sung</h5>
                  <div className="form-group">
                    <textarea
                      name="extra_requirements"
                      className="summernote-editor"
                      style={{ width: "100%", height: 200 }}
                      onChange={(e) => this.onChange(e)}
                    >
                      {extra_requirements}
                    </textarea>
                    {errors.extra_requirements && (
                      <div
                        className="invalid-feedback"
                        style={{ color: "red" }}
                      >
                        {errors.extra_requirements}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="button-group">
                <div className="action-buttons">
                  <div className="upload-button">
                    <button className="btn btn-block btn-primary">
                      Cập nhật
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

EditablePost.propTypes = {
  posts: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getDataAutoComplete: PropTypes.func.isRequired,
  getPostById: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  posts: state.posts,
  errors: state.errors,
});

const mapDispatchToProps = {
  getDataAutoComplete,
  getPostById,
  updatePost,
  addPost,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditablePost));
