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

class CreatePact extends Component {
  state = {
    invitee: '',
    invitees: [],
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
    this.setState({invitee: event.target.value});
  }

  submitInvitee = () => {
    const { invitee, invitees } = this.state;
    db.ref('users').orderByChild('email').equalTo(invitee).once('child_added', snapshot => {
      if (snapshot.exists()) {
        this.setState({
          invitees: [...invitees, invitee],
          invitee: ''
        })
      }
    });
  }

  removeInvitee = (inviteeToRemove) => {
    console.log(inviteeToRemove);
    this.setState({
      invitees: this.state.invitees.filter(invitee => (invitee !== inviteeToRemove))
    });
  }

  handleFrequencyChange = (event, index, value) => {
    this.setState({frequency: value});
  }

  createPact = () => {
    db.ref(`pacts`).push({
      members: [...this.state.invitees, this.props.user.email],
      frequency: this.state.frequency
    })
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
        {this.state.invitees.map((invitee, index) => (
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
              value={this.state.invitee}
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
          {this.state.invitees.length > 0 && inviteeChips}
        </Paper>

        <Paper style={styles.paper}>
          <Subheader>Pact details</Subheader>
          <div style={styles.detailsForm}>
            <TextField
              hintText="What should the pact be called?"
              floatingLabelText="Pact name"
              floatingLabelFixed
              style={styles.textField}
            />
            <SelectField
              floatingLabelText="Goal"
              value={this.state.frequency}
              onChange={this.handleFrequencyChange}
              style={styles.textField}
            >
              <MenuItem value={1} primaryText="Run everyday" />
              <MenuItem value={2} primaryText="Run once every 2 days" />
              <MenuItem value={3} primaryText="Run once every 3 days" />
              <MenuItem value={4} primaryText="Run once every 4 days" />
              <MenuItem value={5} primaryText="Run once every 5 days" />
              <MenuItem value={6} primaryText="Run once every 6 days" />
              <MenuItem value={7} primaryText="Run once every 7 days" />
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

export default connect(null, {
  setAppBarTitle,
  showCloseButton,
  hideCloseButton
})(CreatePact);
