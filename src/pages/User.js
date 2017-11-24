import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import { withRouter } from 'react-router';
import { db, auth } from '../Firebase';
import RaisedButton from 'material-ui/RaisedButton';

class User extends Component {
  state = {
    ownPage: false,
    userData: null
  }

  componentWillMount() {
    if (this.props.userData) {
      this.props.setAppBarTitle(this.props.userData.displayName);
    }
  }

  componentWillReceiveProps(nextProps) {
    // if currently signed in user has been loaded
    if (nextProps.user && nextProps.userData) {
      const uidParam = nextProps.match.params.uid;
      const uidLoggedIn = nextProps.user.uid;
      // if this is user's own page
      if (uidParam === uidLoggedIn) {
        this.setState({
          ownPage: true,
          userData: nextProps.userData
        })
        this.props.setAppBarTitle(nextProps.userData.displayName);
      }
      // if this is someone else's page
      else {
        db.ref(`users/${uidParam}`).once('value', snapshot => {
          this.setState({
            ownPage: false,
            userData: snapshot.val()
          })
          this.props.setAppBarTitle(snapshot.val().displayName);
        })
      }
    }
  }

  signOut = () => {
    auth.signOut()
    this.props.history.push('/')
  }

  render() {
    const styles = {
      user: {}
    };

    return (
      <div style={styles.user}>
        <RaisedButton
          label="Sign out"
          onClick={this.signOut}
        />
      </div>
    );
  }
}

export default connect(state => ({
  user: state.auth.user,
  userData: state.auth.userData
}), {
  setAppBarTitle
})(withRouter(User));
