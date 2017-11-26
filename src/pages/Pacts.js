import React, { Component } from "react";
import { compose } from 'redux';
import { connect } from "react-redux";
import { firebaseConnect, populate } from "react-redux-firebase";
import { setAppBarTitle } from "../store/reducers/ui";
import PactCard from "../components/PactCard";
import FloatingActionButton from "material-ui/FloatingActionButton";
import AddIcon from "material-ui/svg-icons/content/add";
import { withRouter } from "react-router";
import { Tabs, Tab } from "material-ui/Tabs";
import RunIcon from "material-ui/svg-icons/maps/directions-run";
import HistoryIcon from "material-ui/svg-icons/action/history";

class Pacts extends Component {
  state = {
    showEnded: false,
  }

  componentDidMount() {
    this.props.setAppBarTitle("Pacts");
  }

  handleAddButtonClick = () => {
    this.props.history.push("/create-pact");
  };

  showActivePacts = () => {
    this.setState({showEnded: false});
  };

  showEndedPacts = () => {
    this.setState({showEnded: true});
  };

  render() {
    const {showEnded} = this.state;
    const {today, pacts} = this.props;

    const styles = {
      pacts: {
        paddingTop: 72,
        marginBottom: 90
      },
      tabs: {
        position: 'fixed',
        top: 64,
        zIndex: 2,
        width: '100%',
      },
      addButton: {
        position: "fixed",
        bottom: 20,
        right: 20
      }
    };

    const pactCards = pacts && today &&
      Object.entries(pacts)
        .filter(([pactId, pact]) => (
          showEnded ? pact.endsOn <= today : today < pact.endsOn
        ))
        .map(([pactId, pact]) => (
          <PactCard key={pactId} {...pact} pactId={pactId} />
        ));

    const newPactFAB = (
      <FloatingActionButton
        style={styles.addButton}
        onClick={this.handleAddButtonClick}
      >
        <AddIcon />
      </FloatingActionButton>
    )

    return (
      <div style={styles.pacts}>
        <Tabs style={styles.tabs}>
          <Tab
            icon={<RunIcon />}
            label="Active"
            onActive={this.showActivePacts}
          />
          <Tab
            icon={<HistoryIcon />}
            label="Ended"
            onActive={this.showEndedPacts}
          />
        </Tabs>
        {pactCards}
        {newPactFAB}
      </div>
    );
  }
}

const populates = [
  {
    child: 'members',
    root: 'users',
  },
]

export default compose(
  connect(
    state => ({
      pacts: populate(state.firebase, 'pacts', populates),
      today: state.firebase.data.today,
    }),
    {
      setAppBarTitle
    }
  ),
  withRouter,
  firebaseConnect([
    {
      path: 'pacts',
      populates,
    },
  ])
)(Pacts)
