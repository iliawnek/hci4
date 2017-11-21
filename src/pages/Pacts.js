import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import PactCard from "../components/PactCard";
import FloatingActionButton from "material-ui/FloatingActionButton";
import AddIcon from 'material-ui/svg-icons/content/add';
import { withRouter } from 'react-router';

class Pacts extends Component {
  componentWillMount() {
    this.props.setAppBarTitle("Pacts");
  }

  handleAddButtonClick = () => {
    this.props.history.push('/create-pact');
  };

  render() {
    const styles = {
      pacts: {
        marginBottom: 90,
      },
      addButton: {
        position: 'fixed',
        bottom: 20,
        right: 20,
      }
    };

    return (
      <div style={styles.pacts}>
        <PactCard
          title="Office charity run"
          endDate="18/11/17"
          distance="5"
          minutes="25"
          runs="1"
          numberParticipants={5}
        />
        <PactCard
          title="Run from all responsibility"
          endDate="27/11/17"
          distance="1"
          minutes="30"
          runs="2"
          numberParticipants={3}
        />
        <FloatingActionButton
          style={styles.addButton}
          onClick={this.handleAddButtonClick}
        >
          <AddIcon />
        </FloatingActionButton>
      </div>
    );
  }
}

export default connect(null, {
  setAppBarTitle
})(withRouter(Pacts));
