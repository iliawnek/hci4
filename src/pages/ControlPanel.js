import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';

class ControlPanel extends Component {
  componentWillMount() {
    this.props.setAppBarTitle("Control panel");
  }

  changeToday = (dayCount) => {
    const {today, firebase} = this.props;
    const newToday = moment(today).add(dayCount, 'day').format('YYYY-MM-DD');
    firebase.ref('today').set(newToday)
  }

  render() {
    const {today} = this.props;

    const styles = {
      controlPanel: {
        height: '100%',
        display: "flex",
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center"
      },
      buttonContainer: {
        display: 'flex',
      },
      button: {
        margin: 8,
      }
    };

    const todaySentence = (
      <p>Today is {moment(today).format('YYYY-MM-DD')}.</p>
    );

    return (
      <div style={styles.controlPanel}>
        {today && todaySentence}
        <div style={styles.buttonContainer}>
          <RaisedButton
            label="-1 day"
            onClick={this.changeToday.bind(this, -1)}
            style={styles.button}
          />
          <RaisedButton
            label="+1 day"
            onClick={this.changeToday.bind(this, 1)}
            style={styles.button}
            primary={true}
          />
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      today: state.firebase.data.today
    }),
    {
      setAppBarTitle
    }
  ),
  firebaseConnect([
    'today',
  ]),
)(ControlPanel);
