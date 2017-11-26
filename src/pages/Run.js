import React, { Component } from "react";
import { connect } from "react-redux";
import {
  hideAppBar,
  showAppBar,
  showCloseButton,
  hideCloseButton,
  setAppBarTitle,
  hideMenuButton,
  showMenuButton,
} from "../store/reducers/ui";
import { withRouter } from 'react-router';
import { firebaseConnect, populate } from 'react-redux-firebase';
import { compose } from 'redux';
import RaisedButton from "material-ui/RaisedButton";

class Run extends Component {
  state = {
    started: false,
  }

  componentDidMount() {
    this.props.setAppBarTitle('Run');
    this.props.showCloseButton(`/pact/${this.props.match.params.pactId}`);
    this.props.hideMenuButton();
  }

  componentWillUnmount() {
    this.props.showAppBar();
    this.props.hideCloseButton();
    this.props.showMenuButton();
  }

  startRun = () => {
    this.setState({started: true});
    this.props.hideAppBar();
  }

  finishRun = () => {
    const {firebase, currentUid, history, today} = this.props;
    const {windowId, pactId} = this.props.match.params;
    firebase.ref(`windows/${pactId}/${windowId}/completed`).update({
      [currentUid]: today,
    });
    history.push(`/pact/${pactId}`);
  }

  render() {
    const {pact, window} = this.props;
    if (!pact || !window) return null;

    const {started} = this.state;

    const styles = {
      run: {
        height: '100%',
      },
      button: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 100,
      },
      buttonLabel: {
        fontSize: 24,
      },
    };

    const startButton = (
      <RaisedButton
        label="Start"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        primary={true}
        onClick={this.startRun}
      />
    )

    const finishButton = (
      <RaisedButton
        label="Finish"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        secondary={true}
        onClick={this.finishRun}
      />
    )

    return (
      <div style={styles.run}>
        {started ? finishButton : startButton}
      </div>
    );
  }
}

const populates = [
  {
    child: 'members',
    root: 'users'
  },
  {
    child: 'windows',
    root: 'windows'
  },
]

export default compose(
  connect(
    state => ({
      today: state.firebase.data.today,
      pact: populate(state.firebase, 'pact', populates),
      window: state.firebase.data.window,
      currentUid: state.firebase.auth.uid,
    }),
    {
      hideAppBar,
      showAppBar,
      hideCloseButton,
      showCloseButton,
      setAppBarTitle,
      hideMenuButton,
      showMenuButton,
    }
  ),
  withRouter,
  firebaseConnect(({match: {params: {pactId, windowId}}}) => ([
    {
      path: `pacts/${pactId}`,
      storeAs: 'pact',
      populates,
    },
    {
      path: `windows/${pactId}/${windowId}`,
      storeAs: 'window',
    },
  ]))
)(Run);
