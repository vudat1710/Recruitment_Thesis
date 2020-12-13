import store from "./store";
import { Provider } from "react-redux";
import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import "./assets/css/thejobs.css";
import "./assets/css/thejobs.css.map";
import "./assets/css/custom.css";
import "./assets/css/app.min.css";
import "./assets/vendors/dropify/css/dropify.css";
import "./assets/vendors/dropify/css/dropify.min.css";
import "./assets/vendors/themify-icons/css/themify-icons.css";
import "./assets/vendors/font-awesome/css/font-awesome.css";
import "./assets/vendors/font-awesome/css/font-awesome.min.css";
import "./assets/vendors/lity/lity.min.css";
import "./assets/vendors/lity/lity.css";
import "./assets/vendors/summernote/summernote.css";
import "./assets/vendors/switchery/switchery.min.css";
import "./assets/vendors/bootstrap-select/bootstrap-select.min.css";
import "./assets/vendors/bootstrap/css/bootstrap-theme.css";
import "./assets/vendors/bootstrap/css/bootstrap-theme.min.css";
import "./assets/vendors/bootstrap/css/bootstrap-theme.css.map";
import "./assets/vendors/bootstrap/css/bootstrap-theme.min.css.map";
import "./assets/vendors/bootstrap/css/bootstrap.css";
import "./assets/vendors/bootstrap/css/bootstrap.min.css";
import "./assets/vendors/bootstrap/css/bootstrap.min.css.map";
import Header from "./components/Layouts/Header";
import Footer from "./components/Layouts/Footer";
import ManagePost from "./components/ManagePost/ManagePost";
import PostDetails from "./components/ManagePost/PostDetails";
import EditablePost from "./components/ManagePost/EditablePost";
import ManageCompany from "./components/ManageCompany/ManageCompany";
import CompanyDetails from "./components/ManageCompany/CompanyDetails";
import EditableCompany from "./components/ManageCompany/EditableCompany";
import ManageWorkPlace from "./components/ManageWorkPlace/ManageWorkPlace";
import EditableWorkPlace from "./components/ManageWorkPlace/EditableWorkPlace";
import ManageMajor from "./components/ManageMajor/ManageMajor";
import EditableMajor from "./components/ManageMajor/EditableMajor";
import ManageUser from "./components/ManageUser/ManageUser";
import UserDetails from "./components/ManageUser/UserDetails";
import ManageComment from "./components/ManageComment/ManageComment";
import ManageActionType from "./components/ManageActionType/ManageActionType";
import EditableActionType from "./components/ManageActionType/EditableActionType";
import Stats from "./components/Stats/Stats";

class App extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <BrowserRouter>
            <Header />
            <Route exact path="/managePost" component={ManagePost}/>
            <Route exact path="/post/:id" component={PostDetails} />
            <Route exact path="/editPost/:id" component={EditablePost} />
            <Route exact path="/addPost" component={EditablePost} />
            <Route exact path="/manageCompany" component={ManageCompany}/>
            <Route exact path="/company/:id" component={CompanyDetails} />
            <Route exact path="/editCompany/:id" component={EditableCompany} />
            <Route exact path="/addCompany" component={EditableCompany} />
            <Route exact path="/manageWorkPlace" component={ManageWorkPlace}/>
            <Route exact path="/editWorkPlace/:id" component={EditableWorkPlace} />
            <Route exact path="/addWorkPlace" component={EditableWorkPlace} />
            <Route exact path="/manageMajor" component={ManageMajor}/>
            <Route exact path="/editMajor/:id" component={EditableMajor} />
            <Route exact path="/addMajor" component={EditableMajor} />
            <Route exact path="/manageUser" component={ManageUser}/>
            <Route exact path="/user/:id" component={UserDetails} />
            <Route exact path="/manageComment" component={ManageComment}/>
            <Route exact path="/manageActionType" component={ManageActionType}/>
            <Route exact path="/editActionType/:id" component={EditableActionType} />
            <Route exact path="/addActionType" component={EditableActionType} />
            <Route exact path="/" component={Stats} />
          </BrowserRouter>
          <Footer />
        </Provider>
      </div>
    );
  }
}

export default App;

