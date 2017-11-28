import React, { Component } from "react";
import { Card, CardTitle, CardText } from "material-ui/Card";
import Chip from "material-ui/Chip";
import RaisedButton from 'material-ui/RaisedButton';
import Moment from "react-moment";
import { withRouter } from 'react-router';
import { compose } from 'redux';
import { connect } from 'react-redux';

class PactCard extends Component {
  handleClickCard = () => {
    const { history, pactId } = this.props;
    history.push(`/pact/${pactId}`);
  }

  render() {
    const {users, pact} = this.props;
    if (!pact) return null;
    const {name, endsOn, frequency, runCount, members} = pact;

    const styles = {
      metrics: {
        display: 'flex',
        justifyContent: 'space-evenly',
        paddingBottom: 32,
      },
      chip: {
        margin: 4,
      },
      chips: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      textCenter: { textAlign: "center" },
      display2: { fontSize: 45 },
      svgIconContainer: {
        display: "inline-block",
        height: 28,
        verticalAlign: "middle"
      },
      cardButton: {
        height: 'auto',
        width: '100%',
        marginBottom: 16,
      },
      cardInnerButton: {
        textAlign: 'left',
      }
    };

    const chips = members && Object.keys(members).map(uid => (
      <Chip
        key={uid}
        style={styles.chip}
      >
        {users && users[uid] && users[uid].displayName}
      </Chip>
    ));

    return (
      <RaisedButton
        style={styles.cardButton}
        buttonStyle={styles.cardInnerButton}
        onClick={this.handleClickCard}
      >
        <Card style={styles.card}>
          <CardTitle
            title={name}
            subtitle={
              <span>
                <Moment parse="YYYY-MM-DD" fromNow ago>
                  {endsOn}
                </Moment>{" "}
                remaining
              </span>
            }
          />
          <CardText>
            <div style={styles.metrics}>
              <div style={styles.textCenter}>
                <span style={styles.display2}>{frequency}</span>
                <br />days per run
              </div>
              <div style={styles.textCenter}>
                <span style={styles.display2}>{runCount}</span>
                <br />
                {"run" + (runCount > 1 ? "s" : "")}
              </div>
            </div>

            <div style={styles.chips}>
              {chips}
            </div>
          </CardText>
        </Card>
      </RaisedButton>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    users: state.firebase.data.users,
  }))
)(PactCard);
