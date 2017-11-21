import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle, showCloseButton, hideCloseButton } from "../store/reducers/ui";
import TextField from "material-ui/TextField";
import Chip from 'material-ui/Chip';
import RaisedButton from "material-ui/RaisedButton";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
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

  render() {
    const inviteeChips = this.state.invitees.map((invitee, index) => (
      <Chip
       key={index}
       onRequestDelete={this.removeInvitee.bind(this, invitee)}
      >
        {invitee}
      </Chip>
    ));

    return (
      <div>
        <TextField
          hintText="Enter an email address"
          floatingLabelText="Invite friends"
          floatingLabelFixed
          value={this.state.invitee}
          onChange={this.handleInviteeChange}
        />
        <RaisedButton
          label="Invite"
          onClick={this.submitInvitee}
        />
        {inviteeChips}

        <SelectField
          floatingLabelText="Frequency"
          value={this.state.frequency}
          onChange={this.handleFrequencyChange}
        >
          <MenuItem value={1} primaryText="Everyday" />
          <MenuItem value={2} primaryText="Once every 2 days" />
          <MenuItem value={3} primaryText="Once every 3 days" />
          <MenuItem value={4} primaryText="Once every 4 days" />
          <MenuItem value={5} primaryText="Once every 5 days" />
          <MenuItem value={6} primaryText="Once every 6 days" />
          <MenuItem value={7} primaryText="Once every 7 days" />
        </SelectField>
      </div>
    )
  }
}

export default connect(null, {
  setAppBarTitle,
  showCloseButton,
  hideCloseButton
})(CreatePact);
