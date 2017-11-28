import React, {Component} from 'react';
import DoneIcon from 'material-ui/svg-icons/action/done';
import XIcon from 'material-ui/svg-icons/navigation/close';
import {cyan100, pink100} from 'material-ui/styles/colors';
import {connect} from 'react-redux';
import RunIcon from 'material-ui/svg-icons/maps/directions-run';
import ordinal from 'ordinal';

class Leaderboard extends Component {
  getMembers = () => {
    const {pact, users} = this.props;
    if (!pact || !users) return;
    const {members} = pact;
    const membersObject = {};
    Object.keys(members).forEach(uid => {
      membersObject[uid] = users[uid];
    })
    return membersObject;
  };

  componentDidMount() {
    this.scrollToCurrentWindow(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {currentWindow: thisWindow, pact: thisPact} = this.props;
    const {currentWindow: nextWindow, pact: nextPact} = nextProps;
    if ((!thisPact || !thisWindow) && nextPact && nextWindow) {
      this.scrollToCurrentWindow(nextProps);
    }
  }

  scrollToCurrentWindow = (props) => {
    const {currentWindow, pact} = props;
    if (!currentWindow || !pact) return;
    const columnWidth = 40;
    const viewableWidth = this.scrollableRef.clientWidth;
    const totalWidth = pact.runCount * columnWidth;
    const offset = (pact.runCount - currentWindow.number - 1) * columnWidth;
    this.scrollableRef.scrollLeft = totalWidth - offset - viewableWidth;
  }

  render () {
    const {windows, currentWindow, today, currentUid} = this.props;
    const members = this.getMembers();

    // calculate points
    let leaderboard = Object.entries(members).map(([uid, {displayName}]) => {
      const initialPoints = 0;
      const points = Object.values(windows).reduce((points, window) => {
        const completed = window.completed && window.completed[uid];
        return points + (completed ? 1 : 0);
      }, initialPoints)
      return {
        uid,
        displayName,
        points,
      }
    });

    // sort leaderboard
    leaderboard.sort((a, b) => {
      return b.points - a.points;
    })

    // calculate positions
    let previousPoints = 0;
    let previousPosition = 0;
    leaderboard = leaderboard.map((member, i) => {
      let position = i + 1;
      if (i !== 0 && (previousPoints === member.points)) {
        position = previousPosition;
      }
      previousPoints = member.points;
      previousPosition = position;
      return {
        ...member,
        position,
      }
    })

    // sort windows in date order
    const windowColumnValues = Object.values(windows).sort((a, b) => (a.startsOn > b.startsOn ? 1 : -1));

    const styles = {
      leaderboard: {
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        marginBottom: 8,
        fontSize: 12,
      },
      scrollable: {
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
      },
      column: {
        display: 'flex',
        flexDirection: 'column',
      },
      cell: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 16,
        width: 16,
        padding: 12,
      },
      titleCell: {
        justifyContent: 'flex-end',
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.54)',
      },
      nameTitleCell: {
        width: 'auto',
      },
      positionTitleCell: {
        justifyContent: 'center',
      },
      windowTitleCell: {
        justifyContent: 'center',
      },
      nameCell: {
        justifyContent: 'flex-end',
        width: 'auto',
      },
      pointsCell: {
      },
      pointsTitleCell: {
      },
      windowCell: {
      },
      lineTopCell: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderTopStyle: 'solid',
      },
      lineRightCell: {
        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0,0.3)',
        borderRightStyle: 'solid',
      },
      currentWindowCell: {
        backgroundColor: pink100,
      },
      userCell: {
        backgroundColor: cyan100,
        fontWeight: 'bold',
      },
    };

    const positionColumn = (
      <div style={styles.column}>
        <div style={{
          ...styles.cell,
          ...styles.titleCell,
          ...styles.positionTitleCell,
        }}>
          #
        </div>
        {leaderboard.map((member, i) => {
          const isCurrentUser = member.uid === currentUid;
          return (
            <div style={{
              ...styles.cell,
              ...styles.lineTopCell,
              ...(isCurrentUser && styles.userCell),
            }} key={i}>
              {ordinal(member.position)}
            </div>
          )
        })}
      </div>
    )

    const nameColumn = (
      <div style={styles.column}>
        <div style={{
          ...styles.cell,
          ...styles.titleCell,
          ...styles.nameTitleCell,
        }}>
          NAME
        </div>
        {leaderboard.map((member, i) => {
          const isCurrentUser = member.uid === currentUid;
          return (
            <div style={{
              ...styles.cell,
              ...styles.nameCell,
              ...styles.lineTopCell,
              ...(isCurrentUser && styles.userCell),
            }} key={i}>
              {member.displayName}
            </div>
          )
        })}
      </div>
    )

    const pointsColumn = (
      <div style={styles.column}>
        <div style={{
          ...styles.cell,
          ...styles.titleCell,
          ...styles.pointsTitleCell,
          ...styles.lineRightCell,
        }}>
          <RunIcon color="rgba(0,0,0,0.54)"/>
        </div>
        {leaderboard.map((member, i) => {
          const isCurrentUser = member.uid === currentUid;
          return (
            <div style={{
              ...styles.cell,
              ...styles.pointsCell,
              ...styles.lineTopCell,
              ...styles.lineRightCell,
              ...(isCurrentUser && styles.userCell),
            }} key={i}>
              {member.points}
            </div>
          )
        })}
      </div>
    )

    const windowColumns = windowColumnValues.map((window, i) => {
      const isCurrentWindow = currentWindow && (window.number === currentWindow.number);
      return (
        <div style={styles.column} key={i}>
          <div style={{
            ...styles.cell,
            ...styles.titleCell,
            ...styles.windowTitleCell,
            ...(isCurrentWindow && styles.currentWindowCell),
          }}>
            {window.number}
          </div>
          {leaderboard.map((member, i) => {
            const completed = window.completed && window.completed[member.uid];
            const hasPassed = window.endsOn <= today;
            return (
              <div style={{
                ...styles.cell,
                ...styles.windowCell,
                ...styles.lineTopCell,
                ...(isCurrentWindow && styles.currentWindowCell),
              }} key={i}>
                {completed && <DoneIcon/>}
                {!completed && hasPassed && <XIcon color="rgba(0,0,0,0.2)"/>}
              </div>
            )
          })}
        </div>
      )
    })

    return (
      <div style={styles.leaderboard}>
        {nameColumn}
        {positionColumn}
        {pointsColumn}
        <div
          style={styles.scrollable}
          ref={div => this.scrollableRef = div}
        >
          {windowColumns}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  today: state.firebase.data.today,
  users: state.firebase.data.users,
  currentUid: state.firebase.auth.uid,
}))(Leaderboard);