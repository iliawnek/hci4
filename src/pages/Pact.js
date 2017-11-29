import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle, showCloseButton, hideCloseButton } from "../store/reducers/ui";
import { withRouter } from 'react-router';
import { firebaseConnect } from 'react-redux-firebase';
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
    const pact = this.getPact(this.props);
    if (pact) {
      this.props.setAppBarTitle(pact.name);
    }
  }

  componentWillUnmount() {
    this.props.hideCloseButton();
  }

  componentWillReceiveProps(nextProps) {
    const thisPact = this.getPact(this.props);
    const nextPact = this.getPact(nextProps);
    if (!thisPact && nextPact) {
      this.props.setAppBarTitle(nextPact.name);
    }
  }

  getPact = (props) => {
    const {pacts} = props;
    const {pactId} = props.match.params;
    return pacts && pacts[pactId];
  }

  getWindows = () => {
    const {windows} = this.props;
    const {pactId} = this.props.match.params;
    return windows && windows[pactId];
  }

  getCurrentWindow = () => {
    const {today} = this.props;
    const windows = this.getWindows();
    if (!windows || !today) return;
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

  getWindowByNumber = (number) => {
    const windows = this.getWindows();
    if (windows) return Object.values(windows).find(window => window.number === number);
  }

  getCurrentStreak = () => {
    const {currentUid} = this.props;
    const currentWindow = this.getCurrentWindow();
    if (currentWindow && currentUid) {
      // existing streak
      let existingStreak = 0;
      if (currentWindow.number > 0) {
        let windowCursor = this.getWindowByNumber(currentWindow.number - 1);
        while (
          windowCursor &&
          windowCursor.completed &&
          windowCursor.completed[currentUid] &&
          windowCursor.number >= 0) {
          existingStreak++;
          windowCursor = this.getWindowByNumber(windowCursor.number - 1);
        }
      }
      const currentWindowCompleted = currentWindow.completed && currentWindow.completed[currentUid];
      return existingStreak + (currentWindowCompleted ? 1 : 0);
    }
  }

  startRun = () => {
    const {history} = this.props;
    const currentWindow = this.getCurrentWindow();
    if (currentWindow) {
      const {pactId} = this.props.match.params;
      const {id: windowId} = currentWindow;
      history.push(`/pact/${pactId}/run/${windowId}`);
    }
  }

  render() {
    const {today, currentUid} = this.props;
    const windows = this.getWindows();
    const pact = this.getPact(this.props);
    if (!pact) return null;
    const currentWindow = this.getCurrentWindow();
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
    const currentStreak = this.getCurrentStreak();

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
        marginBottom: 0,
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
          This is <b>run {currentWindow.number} out of {pact.runCount}</b>.
        </p>
        <p>
          You have <b>{moment(today).to(currentWindow.endsOn, true)} left</b> to complete the current run.
          {currentStreak > 0 && <span> You're currently on a <b>{currentStreak}-run streak</b>. Keep it going!</span>}
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
          You're now on a <b>{currentStreak}-run streak</b>!
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
        <Leaderboard pact={pact} windows={windows} currentWindow={currentWindow}/>
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

export default compose(
  connect(
    state => ({
      today: state.firebase.data.today,
      pacts: state.firebase.data.pacts,
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
  firebaseConnect(),
)(Pact);
