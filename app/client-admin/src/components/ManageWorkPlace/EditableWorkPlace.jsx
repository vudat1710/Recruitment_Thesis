import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TextInputAuth from "../HOC/TextInputAuth";
import {
  getWorkPlaceById,
  updateWorkPlace,
  addWorkPlace,
} from "../../actions/workplace.action";
import SweetAlert from "react-bootstrap-sweetalert";

class EditableWorkPlace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      workPlaceId: 0,
      type: this.props.location.pathname,
      isLoading: true,
      workPlaceUpdate: false,
      workPlaceAdd: false,
      name: "",
      errors: {},
    };
  }

  componentWillReceiveProps(nextPops) {
    if (nextPops.errors) {
      this.setState({ errors: nextPops.errors });
    }
  }

  async componentDidMount() {
    if (this.state.type !== "/addWorkPlace") {
      await this.props.getWorkPlaceById({workPlaceId: this.props.match.params.id});

      this.setState({
        ...this.state,
        workPlaceId: this.props.match.params.id,
        name: this.props.workPlace.searchResults.name,
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
    const { name, type } = this.state;

    let newInfo = {
      name: name.trim().toLowerCase().split(" ").map(x => x[0].toUpperCase() + x.slice(1)).join(" "),
    };
    
    if (type !== "/addWorkPlace") {
      newInfo.workPlaceId = this.state.workPlaceId;
      await this.props.updateWorkPlace(newInfo);
      this.setState({
        ...this.state,
        workPlaceUpdate: this.props.workPlace.workPlaceUpdate,
      });
    } else {
      await this.props.addWorkPlace(newInfo);
      this.setState({
        ...this.state,
        workPlaceAdd: this.props.workPlace.workPlaceAdd,
      });
    }
  }

  onConfirm() {
    if (this.state.type !== "/addWorkPlace") {
      this.setState({
        ...this.state,
        workPlaceUpdate: false,
      });
    } else {
      this.setState({
        ...this.state,
        workPlaceAdd: false,
      });
    }
    window.location.href = "/manageWorkPlace";
  }

  render() {
    let { name, isLoading, errors } = this.state;

    let alertSucc = !this.state.workPlaceUpdate ? (
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

    let alertAddSucc = !this.state.workPlaceAdd ? (
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
          {alertSucc}
          {alertAddSucc}
          <header className="page-header">
            <div className="container page-name">
              <h1 className="text-center">Chỉnh sửa (hoặc thêm) địa điểm làm việc</h1>
              <p className="lead text-center">
                Chỉnh sửa (hoặc thêm) địa điểm làm việc theo ý muốn dành cho quản trị
                viên.
              </p>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-12">
                  <div className="form-group">
                    <label>Tên địa điểm làm việc: </label>
                    <TextInputAuth
                      id="name"
                      type="text"
                      name="name"
                      className="form-control form-control-lg fs-13 px-3 rounded"
                      placeholder="Tên địa điểm làm việc"
                      value={name}
                      onChange={(e) => this.onChange(e)}
                      error={errors.name}
                    />
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

EditableWorkPlace.propTypes = {
  workPlace: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getWorkPlaceById: PropTypes.func.isRequired,
  updateWorkPlace: PropTypes.func.isRequired,
  addWorkPlace: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  workPlace: state.workPlace,
  errors: state.errors,
});

const mapDispatchToProps = {
  getWorkPlaceById,
  updateWorkPlace,
  addWorkPlace,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditableWorkPlace));
