import React, { Component } from "react";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import { withRouter } from "react-router";
import { firebaseConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";

class LoginForm extends Component {
  state = {
    email: "",
    password: ""
  };

  register = async () => {
    await this.props.firebase.auth().createUserWithEmailAndPassword(
      this.state.email,
      this.state.password
    );
    this.props.firebase.updateProfile({
      email: this.props.auth.email,
    });
    this.props.history.push("/setup");
  };

  login = () => {
    this.props.firebase.login({
      email: this.state.email,
      password: this.state.password
    });
    this.props.history.push('/pacts');
  };

  render() {
    const styles = {
      loginForm: {
        width: 256
      },
      loginButtons: {
        marginTop: 20,
        display: "flex",
        justifyContent: "space-between"
      }
    };

    return (
      <div style={styles.loginForm}>
        <TextField
          hintText="Email address"
          value={this.state.email}
          onChange={event => this.setState({ email: event.target.value })}
        />
        <TextField
          type="password"
          hintText="Password"
          value={this.state.password}
          onChange={event => this.setState({ password: event.target.value })}
        />
        <div style={styles.loginButtons}>
          <RaisedButton label="Register" secondary onClick={this.register} />
          <RaisedButton label="Login" primary onClick={this.login} />
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  firebaseConnect(),
  connect(({firebase: {auth}}) => ({
    auth
  }))
)(LoginForm);
