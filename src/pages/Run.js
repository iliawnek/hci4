import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import { withRouter } from 'react-router';
import { firebaseConnect, populate } from 'react-redux-firebase';
import { compose } from 'redux';
import RaisedButton from "material-ui/RaisedButton";

class Run extends Component {
  state = {
    started: false,
  }

  componentWillMount() {
    if (this.props.pact) {
      this.props.setAppBarTitle(this.props.pact.name);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.pact && nextProps.pact) {
      this.props.setAppBarTitle(`Run for ${nextProps.pact.name}`);
    }
  }

  startRun = () => {
    this.setState({started: true})
  }

  finishRun = () => {
    const {firebase, currentUid, history} = this.props;
    const {windowId, pactId} = this.props.match.params;
    firebase.ref(`windows/${windowId}/completed`).update({
      [currentUid]: true,
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
      setAppBarTitle,
    }
  ),
  withRouter,
  firebaseConnect((props) => ([
    {
      path: `pacts/${props.match.params.pactId}`,
      storeAs: 'pact',
      populates,
    },
    {
      path: `windows/${props.match.params.windowId}`,
      storeAs: 'window',
    },
    'today',
  ]))
)(Run);
