import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle, showCloseButton, hideCloseButton } from "../store/reducers/ui";
import { withRouter } from 'react-router';
import { firebaseConnect, populate } from 'react-redux-firebase';
import { compose } from 'redux';
import FloatingActionButton from "material-ui/FloatingActionButton";
import RunIcon from "material-ui/svg-icons/maps/directions-run";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import Subheader from "material-ui/Subheader";
import Leaderboard from "../components/Leaderboard";
import moment from 'moment';

class Pact extends Component {
  componentWillMount() {
    this.props.showCloseButton('/pacts');
    if (this.props.pact) this.props.setAppBarTitle(this.props.pact.name);
    if (this.props.windows) this.getCurrentWindow(nextProps.windows);
  }

  componentWillUnmount() {
    this.props.hideCloseButton();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.pact && nextProps.pact) {
      this.props.setAppBarTitle(nextProps.pact.name);
    }
    if (!this.props.windows && nextProps.windows) {
      this.getCurrentWindow(nextProps.windows);
    }
  }

  getCurrentWindow = (windows) => {
    for (let [windowId, window] of Object.entries(windows)) {
      const {startsOn, endsOn} = window;
      if (startsOn <= this.props.today && this.props.today < endsOn) {
        this.setState({
          currentWindow: {
            ...window,
            id: windowId,
          }
        });
      }
    }
  }

  startRun = () => {
    const {currentWindow} = this.state;
    if (currentWindow) {
      const {history} = this.props;
      const {pactId} = this.props.match.params;
      const {id: windowId} = this.state.currentWindow;
      history.push(`pact/${pactId}/run/${windowId}`);
    }
  }

  render() {
    const {pact, today} = this.props;
    if (!pact) return null;
    const {currentWindow} = pact;

    const styles = {
      pact: {
        marginBottom: 100,
      },
      paper: {
        marginBottom: 16,
        paddingTop: 8,
        paddingBottom: 8,
      },
      paperContent: {
        marginLeft: 16,
        marginRight: 16,
      },
      runButton: {
        marginTop: 16,
        marginBottom: 16,
        height: 50,
      },
      runFAB: {
        position: "fixed",
        bottom: 20,
        right: 20
      }
    };

    const runButton = (
      <RaisedButton
        label="Run now"
        secondary={true}
        icon={<RunIcon/>}
        style={styles.runButton}
        onClick={this.startRun}
      />
    )

    const currentWindowSection = (
      <Paper style={styles.paper}>
        <Subheader>Current run</Subheader>
        <div style={styles.paperContent}>
          <p>
            You are on <b>run {currentWindow.number} out of {pact.runCount}</b>.
          </p>
          <p>
            You have <b>{moment(today).to(currentWindow.endsOn, true)} left</b> to complete the current run.
            You'll earn <b># points</b> if you hit your target.
          </p>
          <p>
            Since you're on a <b>#-run streak</b>, you'll earn <b># bonus points</b> if you keep it going!
          </p>
          {runButton}
        </div>
      </Paper>
    )

    const pactDetailsSection = (
      <Paper style={styles.paper}>
        <Subheader>Pact details</Subheader>
        <div style={styles.paperContent}>
          <p>
            As a member of this pact,
            you have agreed to run <b>{pact.frequency === 1 ? 'everyday' : `every ${pact.frequency} days`}</b> until the pact ends,
            which is on <b>{moment(pact.endsOn).format('Do MMMM YYYY')}</b>.
          </p>
          <p>
            There are <b>{pact.runCount - currentWindow.number + 1} runs</b> left.
          </p>
        </div>
      </Paper>
    )

    const leaderboardSection = (
      <Paper style={styles.paper}>
        <Subheader>Leaderboard</Subheader>
        <Leaderboard pact={pact}/>
      </Paper>
    )

    const runFAB = (
      <FloatingActionButton
        style={styles.runFAB}
        onClick={this.startRun}
        secondary={true}
      >
        <RunIcon />
      </FloatingActionButton>
    )

    return (
      <div style={styles.pact}>
        {currentWindow && currentWindowSection}
        {pactDetailsSection}
        {leaderboardSection}
        {runFAB}
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
    }),
    {
      setAppBarTitle,
      showCloseButton,
      hideCloseButton
    }
  ),
  withRouter,
  firebaseConnect((props) => ([
    {
      path: `pacts/${props.match.params.pactId}`,
      storeAs: 'pact',
      populates,
    },
    'today',
  ]))
)(Pact);
