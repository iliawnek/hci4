import React, { Component } from "react";
import { Card, CardTitle } from "material-ui/Card";
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import {pinkA400} from 'material-ui/styles/colors';

class PactCard extends Component {
  handleClickCard = () => {
    const { history, pactId } = this.props;
    history.push(`/pact/${pactId}`);
  }

  render() {
    const {pact,
      currentWindow,
      today,
      currentWindowCompleted,
      daysUntilCurrentWindowEnds,
      pactEnded,
      users,
    } = this.props;
    if (!pact) return null;

    const dateFormat = 'Do MMMM YYYY';

    const styles = {
      chip: {
        marginRight: 4,
      },
      chips: {
        display: 'flex',
        flexWrap: 'wrap',
        marginLeft: 16,
        marginRight: 16,
      },
      card: {
        paddingBottom: 16,
      },
      cardButton: {
        height: 'auto',
        width: '100%',
        marginBottom: 8,
      },
      cardInnerButton: {
        textAlign: 'left',
      },
      title: {
      },
      subtitle: {
        fontSize: 14,
        fontWeight: (() => {
          if (!currentWindowCompleted && daysUntilCurrentWindowEnds === 1) return 'bold'
          else return 'normal'
        })(),
        color: (() => {
          if (!currentWindowCompleted) {
            if (daysUntilCurrentWindowEnds === 1) return pinkA400
            else return 'black'
          } else {
            return 'rgba(0,0,0,0.5)'
          }
        })(),
      },
    };

    const chips = pact.members && Object.keys(pact.members).map(uid => (
      <Chip
        key={uid}
        style={styles.chip}
      >
        {users && users[uid] && users[uid].displayName}
      </Chip>
    ));

    const subtitle = (() => {
      if (pactEnded) return `ended on ${moment(pact.endsOn).format(dateFormat)}`
      if (currentWindow) {
        if (currentWindowCompleted) return `next run unlocks ${moment(today).to(currentWindow.endsOn)}`
        else return `${moment(today).to(currentWindow.endsOn, true)} remaining to run`
      }
    })()

    return (
      <RaisedButton
        style={styles.cardButton}
        buttonStyle={styles.cardInnerButton}
        onClick={this.handleClickCard}
      >
        <Card style={styles.card}>
          <CardTitle
            title={pact.name}
            subtitle={subtitle}
            titleStyle={styles.title}
            subtitleStyle={styles.subtitle}
          />
          <div style={styles.chips}>
            {chips}
          </div>
        </Card>
      </RaisedButton>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    users: state.firebase.data.users,
    currentUid: state.firebase.auth.uid,
    today: state.firebase.data.today,
  }))
)(PactCard);
