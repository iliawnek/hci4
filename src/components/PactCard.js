import React, { Component } from "react";
import { Card, CardActions, CardTitle, CardText } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import { NavigationExpandMore } from "material-ui/svg-icons";
import Chip from "material-ui/Chip";
import Avatar from "material-ui/Avatar";
import Moment from "react-moment";

class PactCard extends Component {
  state = { users: [] };

  componentDidMount() {
    fetch("https://randomuser.me/api/?results=" + this.props.numberParticipants)
      .then(res => res.json())
      .then(users => this.setState({ users: users.results }));
  }

  render() {
    const styles = {
      textCenter: { textAlign: "center" },
      display2: { fontSize: 45 },
      svgIconContainer: {
        display: "inline-block",
        height: 28,
        verticalAlign: "middle"
      }
    };

    var userChips = [];
    for (var i in this.state.users) {
      var user = this.state.users[i];
      userChips.push(
        <Chip key={i} style={{ margin: 4 }}>
          <Avatar src={user.picture.medium} />
          {user.name.first.charAt(0).toUpperCase() +
            user.name.first.slice(1) +
            " " +
            user.name.last.charAt(0).toUpperCase() +
            user.name.last.slice(1)}
        </Chip>
      );
    }

    return (
      <Card style={{ margin: 8 }}>
        <CardTitle
          title={this.props.title}
          subtitle={
            <span>
              <Moment parse="DD/MM/YY" fromNow ago>
                {this.props.endDate}
              </Moment>{" "}
              remaining
            </span>
          }
        />
        <CardText>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              paddingBottom: 32
            }}
          >
            <div style={styles.textCenter}>
              <span style={styles.display2}>{this.props.distance}</span>
              <br />km
            </div>
            <div style={styles.textCenter}>
              <span style={styles.display2}>{this.props.minutes}</span>
              <br />minutes
            </div>
            <div style={styles.textCenter}>
              <span style={styles.display2}>{this.props.runs}</span>
              <br />
              {"time" + (this.props.runs > 1 ? "s" : "")}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center"
            }}
          >
            {userChips}
          </div>
        </CardText>
        <CardActions>
          <FlatButton
            label={
              <span>
                Show progress
                <div style={styles.svgIconContainer}>
                  <NavigationExpandMore />
                </div>
              </span>
            }
          />
        </CardActions>
      </Card>
    );
  }
}

export default PactCard;
