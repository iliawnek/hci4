import React, { Component } from "react";
import { Card, CardActions, CardTitle, CardText } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { NavigationExpandMore } from "material-ui/svg-icons";
import Chip from "material-ui/Chip";
import Avatar from "material-ui/Avatar";
import Moment from "react-moment";
import {db} from '../Firebase';

class PactCard extends Component {
  state = {
    names: null
  }

  componentDidMount() {
    this.getUserDisplayNames(this.props.members)
  }

  getUserDisplayNames = (uids) => {
    db.ref('users').once('value', snapshot => {
      const users = snapshot.val()
      this.setState({
        names: uids.map(uid => users[uid].displayName)
      })
    })
  }

  render() {
    const styles = {
      card: {
        marginBottom: 8,
      },
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
      }
    };

    const chips = this.state.names && this.state.names.map((name, index) => (
      <Chip
        key={index}
        style={styles.chip}
      >
        {name}
      </Chip>
    ));

    return (
      <Card style={styles.card}>
        <CardTitle
          title={this.props.name}
          subtitle={
            <span>
              <Moment parse="YYYY-MM-DD" fromNow ago>
                {this.props.endsOn}
              </Moment>{" "}
              remaining
            </span>
          }
        />
        <CardText>
          <div style={styles.metrics}>
            <div style={styles.textCenter}>
              <span style={styles.display2}>{this.props.frequency}</span>
              <br />days per run
            </div>
            <div style={styles.textCenter}>
              <span style={styles.display2}>{this.props.runCount}</span>
              <br />
              {"run" + (this.props.runs > 1 ? "s" : "")}
            </div>
          </div>

          <div style={styles.chips}>
            {chips}
          </div>
        </CardText>
      </Card>
    );
  }
}

export default PactCard;
