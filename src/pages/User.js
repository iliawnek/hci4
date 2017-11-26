import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import { withRouter } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';

class User extends Component {
  componentDidMount() {
    if (this.props.user) this.props.setAppBarTitle(this.props.user.displayName)
  }

  componentWillReceiveProps(nextProps) {
    const {user: thisUser} = this.props;
    const {user: nextUser} = nextProps;
    if (!thisUser && nextUser) {
      this.props.setAppBarTitle(nextUser.displayName);
    } else if (thisUser && nextUser && (thisUser.displayName !== nextUser.displayName)) {
      this.props.setAppBarTitle(nextUser.displayName);
    }
  }

  signOut = () => {
    this.props.firebase.auth().signOut()
    this.props.history.push('/')
  }

  render() {
    const {currentUid} = this.props;
    const {uid} = this.props.match.params;
    const ownPage = currentUid === uid;

    const styles = {
      user: {}
    };

    return (
      <div style={styles.user}>
        {ownPage && <RaisedButton
          label="Sign out"
          onClick={this.signOut}
        />}
      </div>
    );
  }
}

export default compose(
  connect(state => ({
    currentUid: state.firebase.auth && state.firebase.auth.uid,
    user: state.firebase.data.user,
  }), {
    setAppBarTitle
  }),
  withRouter,
  firebaseConnect((props) => ([
    {
      path: `users/${props.match.params.uid}`,
      storeAs: 'user',
    },
  ])),
)(User);
