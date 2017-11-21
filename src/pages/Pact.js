import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import { withRouter } from 'react-router';
import { db } from '../Firebase';

class Pact extends Component {
  state = {
    pact: null
  }

  componentWillMount() {
    db.ref(`pacts/${this.props.match.params.pactId}`).on('value', snapshot => {
      this.setState({pact: snapshot.val()});
      this.props.setAppBarTitle(snapshot.val().name);
    });
  }

  render() {
    const styles = {
      pact: {}
    };

    return (
      <div style={styles.pact}>
      </div>
    );
  }
}

export default connect(null, {
  setAppBarTitle
})(withRouter(Pact));
