import Index from "./components/Index/Index";
import store from "./store";
import { Provider } from "react-redux";
import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import setAuthToken from "./utils/setAuthTokens";
import { setCurrentUser } from "./actions/auth.action";
import "./assets/css/thejobs.css";
import "./assets/css/thejobs.css.map";
import "./assets/css/custom.css";
import "./assets/css/app.min.css";
import "./assets/vendors/dropify/css/dropify.css";
import "./assets/vendors/dropify/css/dropify.min.css";
// import './assets/vendors/dropify/css/demo.css';
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
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import Header from "./components/Layouts/Header";
import Footer from "./components/Layouts/Footer";
import AdvancedSearch from "./components/Search/AdvancedSearch";
import PrivateRoute from "./components/HOC/PrivateRoute";

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  // Set user is authenticated
  store.dispatch(setCurrentUser(localStorage.jwtToken));
  // Check for expried token
  const currentTime = Date.now() / 1000;
}

function App() {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
          <Header />
          <Route exact path="/" component={Index} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/forgotPassword" component={ForgotPassword} />
          <Route exact path="/advancedSearch" component={AdvancedSearch} />
        </BrowserRouter>
        <Footer />
      </Provider>
    </div>
  );
}

export default App;
