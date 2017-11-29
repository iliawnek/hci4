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
import { withProps } from "recompose";
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

class Run extends Component {
  state = {
    started: false,
    path: [],
    timeRemining: moment.duration({
      hours: 0,
      minutes: 30,
      seconds: 0
    }),
    targetDistanceKm: 2.0,
    showError: false,
    gpsInterval: null,
    statsIndex: -1,
    finishClickable: false
  };

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        var pathArr = this.state.path;
        pathArr.push({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        this.setState({
          path: pathArr
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
    this.getLocation();
  }

  componentWillUnmount() {
    this.props.showAppBar();
    this.props.hideCloseButton();
    this.props.showMenuButton();
    clearInterval(this.state.gpsInterval);
  }

  startRun = () => {
    this.setState({
      started: true,
      gpsInterval: setInterval(() => {
        this.getLocation();
      }, 2000)
    });
    this.props.hideAppBar();
  };

  clickFinish = () => {
    const { finishClickable } = this.state;
    if (finishClickable) {
      this.finishRun();
    } else {
      this.setState({ finishClickable: true });
      setTimeout(() => {
        this.setState({ finishClickable: false });
      }, 500);
    }
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
      },
      hint: {
        position: "fixed",
        width: "100%",
        textAlign: "center",
        bottom: 20,
        fontSize: 12,
        color: "rgba(255,255,255,0.5)"
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
        <Gesture onPress={() => this.clickFinish}>
          <div style={styles.button} />
        </Gesture>
      </RaisedButton>
    );

    const RunningMap = compose(
      withProps({
        googleMapURL:
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyBB1Ur32D9wh0_tP2CsHiNzHR3DMWVPKdE&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: "100%" }} />,
        containerElement: (
          <div
            style={{
              height: this.state.started
                ? "calc(100vh - 208px)"
                : "calc(100vh - 272px)"
            }}
          />
        ),
        mapElement: <div style={{ height: "100%" }} />
      }),
      withScriptjs,
      withGoogleMap
    )(() => (
      <GoogleMap
        defaultZoom={18}
        defaultCenter={this.state.path[this.state.path.length - 1]}
        clickableIcons={false}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        <Marker position={this.state.path[this.state.path.length - 1]} />
        <Polyline path={this.state.path.slice(1)} />
      </GoogleMap>
    ));

    const doublePressHint = (
      <div style={styles.hint}>(double press to finish)</div>
    );

    return (
      <div style={styles.run}>
        <RunningMap />
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
                  borderTop: "24px solid white",
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
                  borderTop: "24px solid white",
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
          value={0}
          max={this.state.targetDistanceKm}
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
          0.00 / {this.state.targetDistanceKm.toFixed(2)} km
        </span>
        {started ? finishButton : startButton}
        {started && doublePressHint}
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
      currentUid: state.firebase.auth.uid
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
