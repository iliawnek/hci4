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
import {pinkA200} from 'material-ui/styles/colors';

class Pact extends Component {
  componentDidMount() {
    this.props.showCloseButton('/pacts');
    if (this.props.pact) {
      this.props.setAppBarTitle(this.props.pact.name);
    }
  }

  componentWillUnmount() {
    this.props.hideCloseButton();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.pact && nextProps.pact) {
      this.props.setAppBarTitle(nextProps.pact.name);
    }
  }

  getCurrentWindow = (windows, today) => {
    for (let [windowId, window] of Object.entries(windows)) {
      const {startsOn, endsOn} = window;
      if (startsOn <= today && today < endsOn) {
        return {
          ...window,
          id: windowId,
        }
      }
    }
  }

  startRun = () => {
    const {history, today, windows} = this.props;
    const currentWindow = this.getCurrentWindow(windows, today);
    if (currentWindow) {
      const {pactId} = this.props.match.params;
      const {id: windowId} = currentWindow;
      history.push(`/pact/${pactId}/run/${windowId}`);
    }
  }

  render() {
    const {pact, today, windows, currentUid} = this.props;
    if (!pact) return null;
    const currentWindow = windows &&
      this.getCurrentWindow(windows, today);
    const currentWindowCompleted = currentWindow && currentWindow.completed &&
      currentWindow.completed[currentUid] !== undefined;
    const currentWindowCompletedOn = currentWindowCompleted &&
      currentWindow.completed[currentUid];
    const daysSinceCurrentWindowCompleted = currentWindowCompletedOn &&
      moment(today).diff(currentWindowCompletedOn, 'days');
    const runsLeft = currentWindow &&
      pact.runCount - currentWindow.number + (currentWindowCompleted ? 0 : 1);
    const pactEnded = today >= pact.endsOn;
    const dateFormat = 'Do MMMM YYYY';
    const lastWindow = currentWindow &&
      pact.runCount === currentWindow.number;

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
      notice: {
        backgroundColor: pinkA200,
        color: 'white',
      },
      noticeContent: {
        display: 'flex',
        justifyContent: 'center',
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

    const pactCompletedNotice = pactEnded && (
      <Paper style={{...styles.paper, ...styles.notice}}>
        <div style={{...styles.paperContent, ...styles.noticeContent}}>
          <p>This pact ended on {moment(pact.endsOn).format(dateFormat)}.</p>
        </div>
      </Paper>
    )

    const runButtonLabel = (() => {
      if (currentWindowCompleted) {
        if (lastWindow) {
          return 'Last run completed'
        } else {
          return `Next run unlocks ${moment(today).to(currentWindow.endsOn)}`
        }
      } else {
        return 'Run now'
      }
    })()

    const runButton = (
      <RaisedButton
        label={runButtonLabel}
        secondary={true}
        icon={<RunIcon/>}
        style={styles.runButton}
        onClick={this.startRun}
        disabled={currentWindowCompleted}
      />
    )

    const currentWindowNotCompletedContent = currentWindow && (
      <div>
        <p>
          You are on <b>run {currentWindow.number} out of {pact.runCount}</b>.
        </p>
        <p>
          You have <b>{moment(today).to(currentWindow.endsOn, true)} left</b> to complete the current run.
          You'll earn <b># points</b> if you hit your target.
        </p>
        <p>
          Since you're on a <b>#-run streak</b>, you'll also earn <b># bonus points</b> if you keep it going!
        </p>
      </div>
    )

    const currentWindowCompletedContent = currentWindow && (
      <div>
        <p>
          You completed <b>run {currentWindow.number} out of {pact.runCount}</b> on {moment(currentWindowCompletedOn).format(dateFormat)} ({
            (() => {
              switch (daysSinceCurrentWindowCompleted) {
                case 0:
                  return 'today'
                case 1:
                  return 'yesterday'
                default:
                  return `${daysSinceCurrentWindowCompleted}\u00a0days\u00a0ago`
              }
            })()
          }).
        </p>
        <p>
          Your streak has been extended to <b># runs in a row</b>.
        </p>
      </div>
    )

    const currentWindowSection = currentWindow && (
      <Paper style={styles.paper}>
        <Subheader>Current run</Subheader>
        <div style={styles.paperContent}>
          {currentWindowCompleted ? currentWindowCompletedContent : currentWindowNotCompletedContent}
          {runButton}
        </div>
      </Paper>
    )

    const pactGoalSection = (
      <Paper style={styles.paper}>
        <Subheader>Pact goal</Subheader>
        <div style={styles.paperContent}>
          <p>
            As a member of this pact, you agreed to:
          </p>
          <ul>
            <li>
              run <b>{pact.frequency === 1 ? 'everyday' : `every ${pact.frequency} days`}</b>
            </li>
            <li>
              from <b>{moment(pact.startsOn).format(dateFormat)}</b>
            </li>
            <li>
              to <b>{moment(pact.endsOn).format(dateFormat)}</b>.
            </li>
          </ul>
          {currentWindow && <p>
            There {runsLeft === 1 ? 'is' : 'are'} <b>{runsLeft} {runsLeft === 1 ? 'run' : 'runs'}</b> remaining.
          </p>}
        </div>
      </Paper>
    )

    const leaderboardSection = (
      <Paper style={styles.paper}>
        <Subheader>Leaderboard</Subheader>
        <Leaderboard pact={pact}/>
      </Paper>
    )

    const runFAB = !currentWindowCompleted && !pactEnded && (
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
        {pactCompletedNotice}
        {currentWindowSection}
        {leaderboardSection}
        {pactGoalSection}
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
]

export default compose(
  connect(
    state => ({
      today: state.firebase.data.today,
      pact: populate(state.firebase, 'pact', populates),
      windows: state.firebase.data.windows,
      currentUid: state.firebase.auth.uid,
    }),
    {
      setAppBarTitle,
      showCloseButton,
      hideCloseButton
    }
  ),
  withRouter,
  firebaseConnect(({match: {params: {pactId}}}) => ([
    {
      path: `pacts/${pactId}`,
      storeAs: 'pact',
      populates,
    },
    {
      path: `windows/${pactId}`,
      storeAs: 'windows',
    },
  ]))
)(Pact);
