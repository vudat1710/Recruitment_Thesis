import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import { Link, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import TextInputAuth from "../HOC/TextInputAuth";
import {
  getActionTypeById,
  updateActionType,
  addActionType,
} from "../../actions/action.action";
import SweetAlert from "react-bootstrap-sweetalert";

class EditableActionType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionTypeId: 0,
      type: this.props.location.type,
      isLoading: true,
      actionTypeUpdate: false,
      actionTypeAdd: false,
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
    if (this.state.type !== "add") {
      await this.props.getActionTypeById({actionTypeId: this.props.match.params.id});

      this.setState({
        ...this.state,
        actionTypeId: this.props.match.params.id,
        name: this.props.actions.searchResults.name,
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
      name: name,
    };
    if (type !== "add") {
      newInfo.actionTypeId = this.state.actionTypeId;
      await this.props.updateActionType(newInfo);
      this.setState({
        ...this.state,
        actionTypeUpdate: this.props.actions.actionTypeUpdate,
      });
    } else {
      await this.props.addActionType(newInfo);
      this.setState({
        ...this.state,
        actionTypeAdd: this.props.actions.actionTypeAdd,
      });
    }
  }

  onConfirm() {
    if (this.state.type !== "add") {
      this.setState({
        ...this.state,
        actionTypeUpdate: false,
      });
    } else {
      this.setState({
        ...this.state,
        actionTypeAdd: false,
      });
    }
  }

  render() {
    let { name, isLoading, errors } = this.state;

    let alertSucc = !this.state.actionTypeUpdate ? (
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

    let alertAddSucc = !this.state.actionTypeAdd ? (
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
              <h1 className="text-center">Chỉnh sửa (hoặc thêm) hành động</h1>
              <p className="lead text-center">
                Chỉnh sửa (hoặc thêm) hành động theo ý muốn dành cho quản trị
                viên.
              </p>
            </div>

            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-sm-12">
                  <div className="form-group">
                    <label>Tên hành động: </label>
                    <TextInputAuth
                      id="name"
                      type="text"
                      name="name"
                      className="form-control form-control-lg fs-13 px-3 rounded"
                      placeholder="Tên hành động"
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

EditableActionType.propTypes = {
  actions: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getActionTypeById: PropTypes.func.isRequired,
  updateActionType: PropTypes.func.isRequired,
  addActionType: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  actions: state.actions,
  errors: state.errors,
});

const mapDispatchToProps = {
  getActionTypeById,
  updateActionType,
  addActionType,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(EditableActionType));
