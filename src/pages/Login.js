import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import LoginForm from "../components/LoginForm";
import { withRouter } from "react-router";
import Card from 'material-ui/Card';

class Login extends Component {
  componentWillMount() {
    this.props.setAppBarTitle("Login");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userExists) {
      this.props.history.push("/pacts");
    }
  }

  render() {
    const styles = {
      login: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }
    };

    return (
      <Card style={styles.login}>
        <LoginForm />
      </Card>
    );
  }
}

export default withRouter(
  connect(
    ({firebase: {auth: {isEmpty, isLoaded}}}) => ({
      userExists: isLoaded && !isEmpty,
    }),
    {
      setAppBarTitle
    }
  )(Login)
);
