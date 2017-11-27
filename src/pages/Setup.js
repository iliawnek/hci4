import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle, hideMenuButton, showMenuButton } from "../store/reducers/ui";
import Paper from "material-ui/Paper";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import TimePicker from "material-ui/TimePicker";
import { Step, Stepper, StepLabel, StepContent } from "material-ui/Stepper";
import { withRouter } from "react-router";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from 'redux';

class Setup extends Component {
  state = {
    stepIndex: 0,
    displayName: "",
    distance: 0,
    timeLimit: 0,
    timeLimitDate: new Date(new Date().setHours(0, 0, 0, 0))
  };

  componentDidMount() {
    this.props.setAppBarTitle("Setting up");
    this.props.hideMenuButton();
  }

  componentWillUnmount() {
    this.props.showMenuButton();
  }

  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1
    });
  };

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  };

  handleChangeTimeLimitDate = (event, date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeLimit = hours * 60 + minutes;
    this.setState({
      timeLimit,
      timeLimitDate: date
    });
  };

  handleChangeDisplayName = event => {
    this.setState({ displayName: event.target.value });
  };

  handleChangeDistance = event => {
    const {value} = event.target;
    let newDistance;
    if (value === "") newDistance = value;
    else {
      newDistance = parseFloat(value);
      if (newDistance <= 0) return;
    }
    this.setState({
      distance: newDistance
    });
  };

  finish = () => {
    this.props.firebase.updateProfile({
      displayName: this.state.displayName,
      timeLimit: this.state.timeLimit,
      distance: this.state.distance,
    });
    this.props.history.push("/pacts");
  };

  renderStepActions(step) {
    const { stepIndex, displayName, distance, timeLimit } = this.state;
    const finished = stepIndex === 3;

    return (
      <div style={{ margin: "12px 0" }}>
        <RaisedButton
          label={finished ? "Finish" : "Next"}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onClick={finished ? this.finish : this.handleNext}
          style={{ marginRight: 12 }}
          disabled={
            (stepIndex === 1 && displayName === "") ||
            (stepIndex === 2 && (
              distance === "" ||
              timeLimit <= 0
            ))
          }
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onClick={this.handlePrev}
          />
        )}
      </div>
    );
  }

  render() {
    const { stepIndex } = this.state;

    const styles = {
      setup: {
        width: "100%",
        padding: 16,
        paddingBottom: 24,
        boxSizing: "border-box"
      },
      text: {
        fontSize: 20
      },
      stepper: {
        width: "calc(100vw - 64px)"
      },
      floatingLabelText: {
        color: "rgba(0,0,0,0.3)",
        fontSize: 12,
        transform: "translateY(8px)"
      }
    };

    return (
      <Paper style={styles.setup}>
        <Stepper
          style={styles.stepper}
          activeStep={stepIndex}
          orientation="vertical"
        >
          <Step>
            <StepLabel>About the app</StepLabel>
            <StepContent>
              <p>Create pacts with friends and family where everybody in the pact must run regularly.</p>
              <p>Build up run streaks by going for runs consistently.</p>
              <p>Compete with others in the pact to come out on top of the pact's leaderboard!</p>
              {this.renderStepActions(0)}
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Choose a display name</StepLabel>
            <StepContent>
              <TextField
                hintText="What is your name?"
                floatingLabelText="Display name"
                floatingLabelFixed
                value={this.state.displayName}
                onChange={this.handleChangeDisplayName}
              />
              {this.renderStepActions(1)}
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Choose your target run</StepLabel>
            <StepContent>
              <p>
                Worried about not being able to keep up others? Don't worry!
                That's exactly why we have the concept of a <b>target run</b>.
              </p>
              <p>
                Your <b>target run</b> defines the minimum run that counts towards a completed run within a pact.
              </p>
              <p>
                It should be easy enough to be consistently achievable,
                but difficult enough to be challenging!
              </p>
              <TextField
                type="number"
                floatingLabelText="Distance (km)"
                floatingLabelFixed
                value={this.state.distance}
                onChange={this.handleChangeDistance}
              />
              <div style={styles.floatingLabelText}>
                Time limit (hours:minutes)
              </div>
              <TimePicker
                format="24hr"
                value={this.state.timeLimitDate}
                onChange={this.handleChangeTimeLimitDate}
              />
              {this.renderStepActions(2)}
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Finished!</StepLabel>
            <StepContent>
              <p>
                Now create your own running pact, or ask somebody else to invite you to theirs.
              </p>
              <p>
                Have fun!
              </p>
              {this.renderStepActions(3)}
            </StepContent>
          </Step>
        </Stepper>
      </Paper>
    );
  }
}

export default compose(
  connect(null, {
    setAppBarTitle,
    hideMenuButton,
    showMenuButton
  }),
  firebaseConnect(),
  withRouter
)(Setup);
