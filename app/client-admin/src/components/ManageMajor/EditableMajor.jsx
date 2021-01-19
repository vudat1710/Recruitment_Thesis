import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TextInputAuth from "../HOC/TextInputAuth";
import {
  getMajorById,
  updateMajor,
  addMajor,
} from "../../actions/major.action";
import SweetAlert from "react-bootstrap-sweetalert";

class EditableMajor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      majorId: 0,
      type: this.props.location.pathname,
      isLoading: true,
      majorUpdate: false,
      majorAdd: false,
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
    if (this.state.type !== "/addMajor") {
      await this.props.getMajorById({
        majorId: this.props.match.params.id,
      });

      this.setState({
        ...this.state,
        majorId: this.props.match.params.id,
        name: this.props.major.searchResults.name,
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
      name: name.trim().split(" ").map(x => x[0].toUpperCase() + x.slice(1)).join(" "),
    };
    if (type !== "/addMajor") {
      newInfo.majorId = this.state.majorId;
      await this.props.updateMajor(newInfo);
      this.setState({
        ...this.state,
        majorUpdate: this.props.major.majorUpdate,
      });
    } else {
      await this.props.addMajor(newInfo);
      this.setState({
        ...this.state,
        majorAdd: this.props.major.majorAdd,
      });
    }
  }

  onConfirm() {
    if (this.state.type !== "/addMajor") {
      this.setState({
        ...this.state,
        majorUpdate: false,
      });
    } else {
      this.setState({
        ...this.state,
        majorAdd: false,
      });
    }

    window.location.href = "/manageMajor";
  }

  render() {
    let { name, isLoading, errors } = this.state;

    let alertSucc = !this.state.majorUpdate ? (
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

    let alertAddSucc = !this.state.majorAdd ? (
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
              <h1 className="text-center">
                Chỉnh sửa (hoặc thêm) ngành nghề
              </h1>
              <p className="lead text-center">
                Chỉnh sửa (hoặc thêm) ngành nghề theo ý muốn dành cho
                quản trị viên.
              </p>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-12">
                  <div className="form-group">
                    <label>Tên ngành nghề: </label>
                    <TextInputAuth
                      id="name"
                      type="text"
                      name="name"
                      className="form-control form-control-lg fs-13 px-3 rounded"
                      placeholder="Tên ngành nghề"
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

EditableMajor.propTypes = {
  major: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getMajorById: PropTypes.func.isRequired,
  updateMajor: PropTypes.func.isRequired,
  addMajor: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  major: state.major,
  errors: state.errors,
});

const mapDispatchToProps = {
  getMajorById,
  updateMajor,
  addMajor,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditableMajor));
