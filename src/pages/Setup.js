import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import TimePicker from "material-ui/TimePicker";
import { Step, Stepper, StepLabel, StepContent } from "material-ui/Stepper";
import { db } from '../Firebase';
import { withRouter } from "react-router";

class Setup extends Component {
  state = {
    stepIndex: 0,
    displayName: "",
    distance: 0,
    timeLimit: 0,
    timeLimitDate: new Date(new Date().setHours(0, 0, 0, 0))
  };

  componentWillMount() {
    this.props.setAppBarTitle("Setting up");
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
    this.setState({
      distance: parseFloat(event.target.value)
    });
  };

  finish = () => {
    const { uid } = this.props.user
    db.ref(`users/${uid}`).update({
      displayName: this.state.displayName,
      timeLimit: this.state.timeLimit,
      distance: this.state.distance,
    })
    this.props.history.push("/create-pact");
  };

  renderStepActions(step) {
    const { stepIndex } = this.state;
    const finished = stepIndex === 2;

    return (
      <div style={{ margin: "12px 0" }}>
        <RaisedButton
          label={finished ? "Create" : "Next"}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onClick={finished ? this.finish : this.handleNext}
          style={{ marginRight: 12 }}
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
        height: "100%",
        margin: 16,
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
      <div style={styles.setup}>
        <Stepper
          style={styles.stepper}
          activeStep={stepIndex}
          orientation="vertical"
        >
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
              {this.renderStepActions(0)}
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Choose your target run</StepLabel>
            <StepContent>
              <p>
                Your <b>target run</b> defines the run you must aim to finish to{" "}
                <b>earn points</b>.
              </p>
              <p>
                It should be easy enough to be achievable, but difficult enough
                to challenging!
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
              {this.renderStepActions(1)}
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Create a running pact</StepLabel>
            <StepContent>
              <p>
                Create a <b>running pact</b> with your friends and family in
                order to <b>begin earning points</b>!
              </p>
              {this.renderStepActions(2)}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}

export default connect(state => ({
  user: state.auth.user,
}), {
  setAppBarTitle
})(withRouter(Setup));
