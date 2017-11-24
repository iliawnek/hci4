import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle, showCloseButton, hideCloseButton } from "../store/reducers/ui";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import Chip from 'material-ui/Chip';
import RaisedButton from "material-ui/RaisedButton";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Subheader from "material-ui/Subheader";
import DatePicker from "material-ui/DatePicker";
import { db } from '../Firebase';
import moment from 'moment';

class CreatePact extends Component {
  state = {
    emailToInvite: '',
    invited: {},
    name: '',
    frequency: 3,
    runCount: '',
    endsOn: null
  }

  componentWillMount() {
    this.props.setAppBarTitle("Create pact");
    this.props.showCloseButton('/pacts');
  }

  componentWillUnmount() {
    this.props.hideCloseButton();
  }

  handleInviteeChange = (event) => {
    this.setState({emailToInvite: event.target.value});
  }

  submitInvitee = () => {
    const { emailToInvite, invited } = this.state;
    const { user } = this.props;
    if (emailToInvite !== user.email && !Object.values(invited).includes(emailToInvite)) {
      db.ref('users').orderByChild('email').equalTo(emailToInvite).once('child_added', snapshot => {
        if (snapshot.exists()) {
          const uid = snapshot.key;
          this.setState({
            invited: {...invited, [uid]: snapshot.val().email},
            emailToInvite: ''
          })
        }
      });
    }
  }

  removeInvitee = (inviteeToRemove) => {
    const { invited } = this.state;
    const uidToRemove = Object.entries(invited).filter(entry => entry[1] === inviteeToRemove)[0][0];
    this.setState({
      invited: Object.keys(invited).reduce((newInvited, uid) => {
        if (uid !== uidToRemove) newInvited[uid] = invited[uid];
        return newInvited;
      }, {})
    });
  }

  handleFrequencyChange = (event, index, value) => {
    const frequency = value;
    this.setState({frequency});
    if (this.state.runCount !== '') {
      const daysUntilEndDate = frequency * this.state.runCount;
      const endsOn = moment(this.props.today).add(daysUntilEndDate, 'days').toDate();
      this.setState({endsOn});
    }
  }

  createPact = () => {
    const {invited, frequency, name, runCount, endsOn} = this.state;
    const {today} = this.props;
    const members = [...Object.keys(invited), this.props.user.uid];
    // create pact
    const newPactRef = db.ref('pacts').push();
    const newPactId = newPactRef.key;
    newPactRef.set({
      members,
      frequency,
      startsOn: today,
      runCount,
      endsOn: moment(endsOn).format('YYYY-MM-DD'),
      name,
    })
    // add pact to each member's user data
    members.forEach(uid => {
      db.ref(`users/${uid}/pacts/${newPactId}`).set(true);
    });
    // redirect to new pact page
    this.props.history.push(`/pact/${newPactId}`);
  }

  handleNameChange = (event) => {
    this.setState({name: event.target.value});
  }

  handleRunCountChange = (event) => {
    const runCountString = event.target.value;
    if (runCountString === '') this.setState({runCount: '', endsOn: null});
    else {
      const runCount = parseInt(runCountString);
      if (runCount <= 100 && runCount > 0) {
        const daysUntilEndDate = this.state.frequency * runCount;
        const endsOn = moment(this.props.today).add(daysUntilEndDate, 'days').toDate();
        this.setState({runCount, endsOn});
      }
    }
  }

  handleEndDateChange = (event, date) => {
    const daysUntilEndDate = moment(date).diff(this.props.today, 'days');
    this.setState({
      endsOn: date,
      runCount: Math.floor(daysUntilEndDate / this.state.frequency)
    });
  }

  shouldDisableDate = (day) => {
    const dateDoesntAlignWithFrequency = (
      (moment(day).diff(this.props.today, 'days') % this.state.frequency) !== 0
    );
    return dateDoesntAlignWithFrequency;
  }

  render() {
    const styles = {
      createPact: {
        display: 'flex',
        flexDirection: 'column'
      },
      createButtonContainer: {
        display: 'flex',
        flexDirection: 'row-reverse',
        marginTop: 16,
        marginRight: 16,
        marginBottom: 16
      },
      paper: {
        marginBottom: 16,
        paddingTop: 8,
        paddingBottom: 8,
      },
      inviteForm: {
        display: 'flex',
        alignItems: 'center',
        margin: '0 16px'
      },
      chip: {
        margin: 4
      },
      chips: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: '16px 8px 0 8px'
      },
      detailsForm: {
        margin: '0 16px'
      },
      field: {
        width: '100%'
      },
      pactDeadlineForm: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
      },
      or: {
        margin: '0 16px',
        color: 'rgba(0,0,0,0.25)'
      },
      pactDeadlineField: {
        width: '10px'
      }
    }

    const inviteeChips = (
      <div style={styles.chips}>
        {Object.values(this.state.invited).map((invitee, index) => (
          <Chip
            key={index}
            onRequestDelete={this.removeInvitee.bind(this, invitee)}
            style={styles.chip}
          >
            {invitee}
          </Chip>
        ))}
      </div>
    );

    const readyToCreate = (
      Object.keys(this.state.invited).length > 0 &&
      this.state.name.length > 0 &&
      this.state.runCount !== '' &&
      this.state.endsOn !== null
    )

    return (
      <div>
        <Paper style={styles.paper}>
          <Subheader>Invite friends</Subheader>
          <div style={styles.inviteForm}>
            <TextField
              hintText="Enter an email address..."
              value={this.state.emailToInvite}
              onChange={this.handleInviteeChange}
              style={{flex: 1}}
            />
            <div style={{marginLeft: 32}}>
              <RaisedButton
                label="Invite"
                onClick={this.submitInvitee}
              />
            </div>
          </div>
          {(Object.keys(this.state.invited).length > 0) && inviteeChips}
        </Paper>

        <Paper style={styles.paper}>
          <Subheader>Pact name</Subheader>
          <div style={styles.detailsForm}>
            <TextField
              hintText="Choose a name..."
              style={styles.field}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </div>
        </Paper>

        <Paper style={styles.paper}>
          <Subheader>Pact goal</Subheader>
          <div style={styles.detailsForm}>
            <SelectField
              floatingLabelText="Run frequency"
              floatingLabelFixed
              value={this.state.frequency}
              onChange={this.handleFrequencyChange}
              style={styles.field}
            >
              <MenuItem value={1} primaryText="Everyday" />
              <MenuItem value={2} primaryText="Every 2 days" />
              <MenuItem value={3} primaryText="Every 3 days" />
              <MenuItem value={4} primaryText="Every 4 days" />
              <MenuItem value={5} primaryText="Every 5 days" />
              <MenuItem value={6} primaryText="Every 6 days" />
              <MenuItem value={7} primaryText="Every 7 days" />
            </SelectField>
            <TextField
              floatingLabelText="Number of runs required"
              floatingLabelFixed
              style={styles.field}
              type="number"
              value={this.state.runCount}
              onChange={this.handleRunCountChange}
            />
            <DatePicker
              floatingLabelText="Ends on"
              floatingLabelFixed
              textFieldStyle={styles.field}
              value={this.state.endsOn}
              onChange={this.handleEndDateChange}
              minDate={moment(this.props.today).add(this.state.frequency, 'days').toDate()}
              shouldDisableDate={this.shouldDisableDate}
            />
          </div>
        </Paper>

        <div style={styles.createButtonContainer}>
          <RaisedButton
            label="Create"
            primary
            onClick={this.createPact}
            disabled={!readyToCreate}
          />
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  user: state.auth.user,
  today: state.date.today
}), {
  setAppBarTitle,
  showCloseButton,
  hideCloseButton
})(CreatePact);
