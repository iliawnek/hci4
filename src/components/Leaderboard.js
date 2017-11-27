import React, {Component} from 'react';
import DoneIcon from 'material-ui/svg-icons/action/done';
import XIcon from 'material-ui/svg-icons/navigation/close';
import {cyan500} from 'material-ui/styles/colors';
import {connect} from 'react-redux';

class Leaderboard extends Component {
  render () {
    const {pact, windows, currentWindow, today} = this.props;
    const {members} = pact;

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

    // sort windows
    const windowColumnValues = Object.values(windows).sort((a, b) => (a.startsOn > b.startsOn ? 1 : -1));

    console.log('leaderboard', leaderboard)
    console.log('windowColumnValues', windowColumnValues)

    const styles = {
      leaderboard: {
        display: 'flex',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        marginBottom: 8,
        fontSize: 12,
        // border: '1px solid red',
        paddingLeft: 16,
        paddingRight: 16,
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
        // border: '1px solid black',
        width: 'auto',
        padding: 12,
      },
      titleCell: {
        justifyContent: 'flex-end',
        fontWeight: 'bold',
        color: 'rgba(0,0,0,0.54)',
      },
      windowTitleCell: {
        justifyContent: 'center',
        width: 16,
      },
      nameCell: {
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderTopStyle: 'solid',
      },
      pointsCell: {
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderTopStyle: 'solid',
      },
      windowCell: {
        width: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.3)',
        borderTopStyle: 'solid',
      },
      currentWindowCell: {
        backgroundColor: cyan500,
      }
    };

    const nameColumn = (
      <div style={styles.column}>
        <div style={{...styles.cell, ...styles.titleCell}}>
          NAME
        </div>
        {leaderboard.map((member, i) => (
          <div style={{...styles.cell, ...styles.nameCell}} key={i}>
            {member.displayName}
          </div>
        ))}
      </div>
    )

    const pointsColumn = (
      <div style={styles.column}>
        <div style={{...styles.cell, ...styles.titleCell}}>
          RUNS
        </div>
        {leaderboard.map((member, i) => (
          <div style={{...styles.cell, ...styles.pointsCell}} key={i}>
            {member.points}
          </div>
        ))}
      </div>
    )

    const windowColumns = windowColumnValues.map((window, i) => (
      <div style={styles.column} key={i}>
        <div style={{...styles.cell, ...styles.titleCell, ...styles.windowTitleCell}}>
          {window.number}
        </div>
        {leaderboard.map((member, i) => {
          const completed = window.completed && window.completed[member.uid];
          const isCurrentWindow = currentWindow && (window.number === currentWindow.number);
          const hasPassed = window.endsOn <= today;
          return (
            <div style={{
              ...styles.cell,
              ...styles.windowCell,
              ...(isCurrentWindow && styles.currentWindowCell),
            }} key={i}>
              {completed && <DoneIcon {...(isCurrentWindow && {color: 'white'})}/>}
              {!completed && hasPassed && <XIcon color="rgba(0,0,0,0.2)"/>}
            </div>
          )
        })}
      </div>
    ))

    return (
      <div style={styles.leaderboard}>
        {nameColumn}
        {pointsColumn}
        {windowColumns}
      </div>
    );
  }
}

export default connect(state => ({
  today: state.firebase.data.today,
}))(Leaderboard);