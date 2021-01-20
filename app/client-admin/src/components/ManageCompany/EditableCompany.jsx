import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TextInputAuth from "../HOC/TextInputAuth";
import {
  getCompanyById,
  updateCompany,
  addCompany,
} from "../../actions/company.action";
import SweetAlert from "react-bootstrap-sweetalert";

class EditableCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      companyId: 0,
      type: this.props.location.pathname,
      isLoading: true,
      companyUpdate: false,
      companyAdd: false,
      name: "",
      description: "",
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
    if (this.state.type !== "/addCompany") {
      await this.props.getCompanyById(this.props.match.params.id);

      this.setState({
        ...this.state,
        companyId: this.props.match.params.id,
        name: this.props.company.companyDetails.name,
        description: this.props.company.companyDetails.description,
        img_url: this.props.company.companyDetails.img_url,
        address: this.props.company.companyDetails.address,
        isLoading: false,
      });
    } else {
      this.setState({
        ...this.state,
        isLoading: false,
      });
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  async onSubmit(e) {
    e.preventDefault();
    const { img_url, description, name, address, type } = this.state;

    let newInfo = {
      description: description,
      name: name.trim(),
      address: address,
      img_url: img_url,
    };
    if (type !== "/addCompany") {
      newInfo.companyId = this.state.companyId;
      await this.props.updateCompany(newInfo);
      this.setState({
        ...this.state,
        companyUpdate: this.props.company.companyUpdate,
      });
    } else {
      newInfo["is_deleted"] = 0;
      await this.props.addCompany(newInfo);
      this.setState({
        ...this.state,
        companyAdd: this.props.company.companyAdd,
      });
    }
  }

  onConfirm() {
    if (this.state.type !== "/addCompany") {
      this.setState({
        ...this.state,
        companyUpdate: false,
      });
    } else {
      this.setState({
        ...this.state,
        companyAdd: false,
      });
    }

    window.location.href = "/manageCompany";
  }

  render() {
    let { img_url, description, name, address, isLoading, errors } = this.state;

    let alertSucc = !this.state.companyUpdate ? (
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

    let alertAddSucc = !this.state.companyAdd ? (
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
                    <label>Tên công ty: </label>
                    <TextInputAuth
                      id="name"
                      type="text"
                      name="name"
                      className="form-control form-control-lg fs-13 px-3 rounded"
                      placeholder="Tên công ty"
                      value={name}
                      onChange={(e) => this.onChange(e)}
                      error={errors.name}
                    />
                  </div>

                  <hr className="hr-lg" />

                  <div className="row">
                    <div className="form-group col-xs-12 col-sm-12">
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
                  </div>

                  <hr className="hr-lg" />

                  <h5>Mô tả công ty</h5>
                  <div className="form-group">
                    <textarea
                      name="description"
                      className="summernote-editor"
                      style={{ width: "100%", height: 200 }}
                      onChange={(e) => this.onChange(e)}
                    >
                      {description}
                    </textarea>
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

EditableCompany.propTypes = {
  company: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getCompanyById: PropTypes.func.isRequired,
  updateCompany: PropTypes.func.isRequired,
  addCompany: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  company: state.company,
  errors: state.errors,
});

const mapDispatchToProps = {
  getCompanyById,
  updateCompany,
  addCompany,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditableCompany));
