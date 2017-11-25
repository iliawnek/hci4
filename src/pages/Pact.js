import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import { withRouter } from 'react-router';
import { firebaseConnect, populate } from 'react-redux-firebase';
import { compose } from 'redux';

class Pact extends Component {
  componentWillReceiveProps(nextProps) {
    console.log(nextProps.pact)
    if (!this.props.pact && nextProps.pact) {
      this.props.setAppBarTitle(nextProps.pact.name);
    }
  }

  render() {
    const styles = {
      pact: {}
    };

    return (
      <div style={styles.pact}>
      </div>
    );
  }
}

const populates = [
  {
    child: 'members',
    root: 'users'
  }
]

export default compose(
  connect(
    state => ({
      pact: populate(state.firebase, 'pact', populates),
    }),
    {
    setAppBarTitle,
    }
  ),
  withRouter,
  firebaseConnect((props) => ([
    {
      path: `pacts/${props.match.params.pactId}`,
      storeAs: 'pact',
      populates,
    }
  ]))
)(Pact);
