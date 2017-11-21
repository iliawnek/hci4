import React, { Component } from "react";
import { connect } from "react-redux";
import { auth, db } from "../Firebase";
import { userLoading, userLoaded, setUser, setUserData } from "../store/reducers/auth";
import { Route } from "react-router-dom";
import Login from "../pages/Login";
import Pacts from "../pages/Pacts";
import Setup from "../pages/Setup";
import CreatePact from '../pages/CreatePact'
import User from "../pages/User";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import { grey100 } from "material-ui/styles/colors";

class Container extends Component {
  componentWillMount() {
    this.props.userLoading();
    auth.onAuthStateChanged(user => {
      this.props.userLoaded();
      this.props.setUser(user);

      if (user) {
        const {uid} = user;
        // add new user to database
        db.ref('/users').once('value', snapshot => {
          if (!snapshot.hasChild(uid)) {
            db.ref(`/users/${uid}`).set({
              email: user.email,
            })
          }
        });
        // create listener for user
        db.ref(`/users/${uid}`).on('value', snapshot => {
          this.props.setUserData(snapshot.val());
        });
      }
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
            <Route path="/create-pact" component={CreatePact} />
            <Route path="/user/:uid" component={User} />
          </div>
        </div>
      </Router>
    );
  }
}

export default connect(null, {
  userLoading,
  userLoaded,
  setUser,
  setUserData
})(Container);
