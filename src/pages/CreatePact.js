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
import { db } from '../Firebase';
import moment from 'moment';

class CreatePact extends Component {
  state = {
    emailToInvite: '',
    invited: {},
    name: '',
    frequency: 1
  }

  componentWillMount() {
    this.props.setAppBarTitle("Create pact");
    this.props.showCloseButton();
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
    this.setState({frequency: value});
  }

  createPact = () => {
    const newPactRef = db.ref('pacts').push();
    const newPactId = newPactRef.key;
    newPactRef.set({
      members: [...Object.keys(this.state.invited), this.props.user.uid],
      frequency: this.state.frequency,
      startedAt: moment().toISOString(),
      name: this.state.name
    })
    this.props.history.push(`/pact/${newPactId}`);
  }

  handleNameChange = (event) => {
    this.setState({name: event.target.value});
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
        marginRight: 16
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
      textField: {
        width: '100%'
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
          {this.state.invited !== {} && inviteeChips}
        </Paper>

        <Paper style={styles.paper}>
          <Subheader>Pact details</Subheader>
          <div style={styles.detailsForm}>
            <TextField
              hintText="What should the pact be called?"
              floatingLabelText="Pact name"
              floatingLabelFixed
              style={styles.textField}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
            <SelectField
              floatingLabelText="Goal"
              value={this.state.frequency}
              onChange={this.handleFrequencyChange}
              style={styles.textField}
            >
              <MenuItem value={1} primaryText="Run everyday" />
              <MenuItem value={2} primaryText="Run every 2 days" />
              <MenuItem value={3} primaryText="Run every 3 days" />
              <MenuItem value={4} primaryText="Run every 4 days" />
              <MenuItem value={5} primaryText="Run every 5 days" />
              <MenuItem value={6} primaryText="Run every 6 days" />
              <MenuItem value={7} primaryText="Run every 7 days" />
            </SelectField>
          </div>
        </Paper>

        <div style={styles.createButtonContainer}>
          <RaisedButton
            label="Create"
            primary
            onClick={this.createPact}
          />
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  user: state.auth.user
}), {
  setAppBarTitle,
  showCloseButton,
  hideCloseButton
})(CreatePact);
