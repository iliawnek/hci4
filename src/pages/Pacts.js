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
  componentDidMount() {
    this.props.setAppBarTitle("Pacts");
  }

  handleAddButtonClick = () => {
    this.props.history.push("/create-pact");
  };

  render() {
    const styles = {
      pacts: {
        marginBottom: 90
      },
      addButton: {
        position: "fixed",
        bottom: 20,
        right: 20
      }
    };

    const pactCards = this.props.pacts && Object.entries(this.props.pacts).map(([pactId, pact]) => (
      <PactCard key={pactId} {...pact} pactId={pactId} />
    ));

    return (
      <div style={{ paddingTop: 72 }}>
        <Tabs style={{ position: "fixed", top: 64, zIndex: 2, width: "100%" }} secondary="true">
          <Tab icon={<RunIcon />} label="Active" />
          <Tab icon={<HistoryIcon />} label="Completed" />
        </Tabs>
        <div style={styles.pacts}>
          {pactCards}
          <FloatingActionButton
            style={styles.addButton}
            onClick={this.handleAddButtonClick}
          >
            <AddIcon />
          </FloatingActionButton>
        </div>
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
    }
  ])
)(Pacts)
