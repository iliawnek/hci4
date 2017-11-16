import React, { Component } from "react";
import { connect } from "react-redux";
import { auth } from "../Firebase";
import { userLoading, userLoaded, setUser } from "../store/reducers/auth";
import { Route } from "react-router-dom";
import Login from "../pages/Login";
import Pacts from "../pages/Pacts";
import Setup from "../pages/Setup";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import { grey100 } from "material-ui/styles/colors";

class Container extends Component {
  componentWillMount() {
    this.props.userLoading();
    auth.onAuthStateChanged(user => {
      this.props.userLoaded();
      this.props.setUser(user);
    });
  }

  render() {
    const styles = {
      content: {
        position: "absolute",
        top: 64,
        bottom: 0,
        left: 0,
        right: 0,
        padding: 8,
        backgroundColor: grey100,
        overflowY: "auto",
        overflowX: "hidden"
      }
    };

    return (
      <Router>
        <div>
          <Header />
          <div style={styles.content}>
            <Route exact path="/" component={Login} />
            <Route path="/pacts" component={Pacts} />
            <Route path="/setup" component={Setup} />
          </div>
        </div>
      </Router>
    );
  }
}

export default connect(null, {
  userLoading,
  userLoaded,
  setUser
})(Container);
