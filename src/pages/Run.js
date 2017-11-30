import React, { Component } from "react";
import { connect } from "react-redux";
import {
  hideAppBar,
  showAppBar,
  showCloseButton,
  hideCloseButton,
  setAppBarTitle,
  hideMenuButton,
  showMenuButton
} from "../store/reducers/ui";
import { withRouter } from "react-router";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from "redux";
import moment from "moment";
import Gesture from "rc-gesture";
import RaisedButton from "material-ui/RaisedButton";
import {
  BottomNavigation,
  BottomNavigationItem
} from "material-ui/BottomNavigation";
import LinearProgress from "material-ui/LinearProgress";
import TerrainIcon from "material-ui/svg-icons/maps/terrain";
import SpeedIcon from "material-ui/svg-icons/av/av-timer";
import TimerIcon from "material-ui/svg-icons/action/hourglass-empty";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline
} from "react-google-maps";
import { Card, CardText } from "material-ui/Card";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries
} from "react-vis";

const RunningMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      zoom={props.zoom}
      center={props.path[props.path.length - 1]}
      clickableIcons={false}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        draggable: false,
        zoomControlOptions: { position: "" }
      }}
    >
      <Marker position={props.path[1]} />
      <Marker position={props.path[props.path.length - 1]} />
      <Polyline path={props.path.slice(1)} />
    </GoogleMap>
  ))
);

class Run extends Component {
  state = {
    started: false,
    path: [],
    distances: [],
    timeRemining: moment.duration({
      minutes: this.props.users[this.props.currentUid].timeLimit
    }),
    showError: false,
    statsIndex: -1,
    mapZoom: 18
  };

  getLocation = () => {
    const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
      const deg2rad = deg => {
        return deg * (Math.PI / 180);
      };

      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1);
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          path: [
            ...this.state.path,
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          ],
          distances: [
            ...this.state.distances,
            this.state.path.length < 2
              ? 0
              : getDistanceFromLatLonInKm(
                  this.state.path[this.state.path.length - 1].lat,
                  this.state.path[this.state.path.length - 1].lng,
                  position.coords.latitude,
                  position.coords.longitude
                )
          ]
        });
      });
    } else {
      this.setState({ showError: true });
    }
  };

  componentDidMount() {
    this.props.setAppBarTitle("Run");
    this.props.showCloseButton(`/pact/${this.props.match.params.pactId}`);
    this.props.hideMenuButton();

    this.timer = null;

    this.getLocation();
  }

  componentWillUnmount() {
    this.props.showAppBar();
    this.props.hideCloseButton();
    this.props.showMenuButton();

    clearInterval(this.timer);
  }

  startRun = () => {
    this.setState({
      started: true
    });
    this.timer = setInterval(() => {
      this.getLocation();
      this.setState({ timeRemining: this.state.timeRemining.subtract(1, "s") });
    }, 1000);
    this.props.hideAppBar();
  };

  finishRun = () => {
    const { firebase, currentUid, history, today } = this.props;
    const { windowId, pactId } = this.props.match.params;
    firebase.ref(`windows/${pactId}/${windowId}/completed`).update({
      [currentUid]: today
    });
    history.push(`/pact/${pactId}`);
  };

  render() {
    const { pacts, windows } = this.props;
    const { pactId, windowId } = this.props.match.params;
    const pact = pacts && pacts[pactId];
    const window = windows && windows[pactId][windowId];
    if (!pact || !window) return null;

    const { started } = this.state;

    const styles = {
      run: {
        height: "100%"
      },
      button: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 128
      },
      buttonLabel: {
        fontSize: 24,
        display: "inline-block",
        lineHeight: "35px",
        paddingTop: "28px",
        pointerEvents: "none"
      }
    };

    const startButton = (
      <RaisedButton
        label={
          <span>
            <span style={{ fontSize: "28px" }}>
              <TimerIcon
                style={{ color: "white", position: "relative", top: 2 }}
              />
              {(this.state.timeRemining.get("h") < 10 ? "0" : "") +
                this.state.timeRemining.get("h") +
                ":" +
                (this.state.timeRemining.get("m") < 10 ? "0" : "") +
                this.state.timeRemining.get("m") +
                ":" +
                (this.state.timeRemining.get("s") < 10 ? "0" : "") +
                this.state.timeRemining.get("s")}
            </span>
            <br />
            <span style={{ fontWeight: 300 }}>TAP TO START</span>
          </span>
        }
        style={styles.button}
        labelStyle={styles.buttonLabel}
        primary={true}
        onClick={this.startRun}
      />
    );

    const finishButton = (
      <RaisedButton
        label={
          <span>
            <span style={{ fontSize: "28px" }}>
              <TimerIcon
                style={{ color: "white", position: "relative", top: 2 }}
              />
              {(this.state.timeRemining.get("h") < 10 ? "0" : "") +
                this.state.timeRemining.get("h") +
                ":" +
                (this.state.timeRemining.get("m") < 10 ? "0" : "") +
                this.state.timeRemining.get("m") +
                ":" +
                (this.state.timeRemining.get("s") < 10 ? "0" : "") +
                this.state.timeRemining.get("s")}
            </span>
            <br />
            <span style={{ fontWeight: 300 }}>HOLD TO FINISH</span>
          </span>
        }
        style={styles.button}
        labelStyle={styles.buttonLabel}
        secondary={true}
      >
        <Gesture onPress={this.finishRun}>
          <div style={styles.button} />
        </Gesture>
      </RaisedButton>
    );

    return (
      <div style={styles.run}>
        <RunningMap
          zoom={this.state.mapZoom}
          path={this.state.path}
          started={this.state.started}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBB1Ur32D9wh0_tP2CsHiNzHR3DMWVPKdE&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: "100%" }} />}
          containerElement={
            <div
              style={{
                height: this.state.started
                  ? "calc(100vh - 208px)"
                  : "calc(100vh - 272px)"
              }}
            />
          }
          mapElement={<div style={{ height: "100%" }} />}
        />
        {this.state.statsIndex >= 0 && (
          <div>
            <Card
              style={{ position: "absolute", bottom: 232, left: 10, right: 10 }}
            >
              <CardText>
                <XYPlot width={300} height={200}>
                  <HorizontalGridLines />
                  <LineSeries
                    data={[{ x: 1, y: 10 }, { x: 2, y: 5 }, { x: 3, y: 15 }]}
                  />
                  <XAxis />
                  <YAxis />
                </XYPlot>
              </CardText>
            </Card>
            <div
              style={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                bottom: 208,
                zIndex: 1
              }}
            >
              <div
                style={{
                  visibility:
                    this.state.statsIndex === 0 ? "visible" : "hidden",
                  width: 0,
                  height: 0,
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderTop: "25px solid white",
                  marginRight: 64,
                  marginLeft: 64
                }}
              />
              <div
                style={{
                  visibility:
                    this.state.statsIndex === 1 ? "visible" : "hidden",
                  width: 0,
                  height: 0,
                  borderLeft: "20px solid transparent",
                  borderRight: "20px solid transparent",
                  borderTop: "25px solid white",
                  marginRight: 64,
                  marginLeft: 64
                }}
              />
            </div>
          </div>
        )}
        <BottomNavigation selectedIndex={this.state.statsIndex}>
          <BottomNavigationItem
            label="Speed"
            icon={<SpeedIcon />}
            onClick={() =>
              this.setState({
                statsIndex: this.state.statsIndex === 0 ? -1 : 0
              })
            }
          />
          <BottomNavigationItem
            label="Elevation"
            icon={<TerrainIcon />}
            onClick={() =>
              this.setState({
                statsIndex: this.state.statsIndex === 1 ? -1 : 1
              })
            }
          />
        </BottomNavigation>
        <LinearProgress
          mode="determinate"
          value={this.state.distances.reduce((a, b) => a + b, 0)}
          max={this.props.users[this.props.currentUid].distance}
          style={{ height: "24px" }}
        />
        <span
          style={{
            position: "absolute",
            width: "100%",
            textAlign: "center",
            marginTop: "-23px",
            height: "24px",
            color: "white"
          }}
        >
          {this.state.distances.reduce((a, b) => a + b, 0).toFixed(2)} /{" "}
          {this.props.users[this.props.currentUid].distance.toFixed(2)} km
        </span>
        {started ? finishButton : startButton}
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
      users: state.firebase.data.users
    }),
    {
      hideAppBar,
      showAppBar,
      hideCloseButton,
      showCloseButton,
      setAppBarTitle,
      hideMenuButton,
      showMenuButton
    }
  ),
  withRouter,
  firebaseConnect()
)(Run);
