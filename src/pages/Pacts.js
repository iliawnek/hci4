import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import PactCard from "../components/PactCard";
import FloatingActionButton from "material-ui/FloatingActionButton";
import AddIcon from "material-ui/svg-icons/content/add";
import { withRouter } from "react-router";
import { db } from "../Firebase";
import { Tabs, Tab } from "material-ui/Tabs";
import RunIcon from "material-ui/svg-icons/maps/directions-run";
import HistoryIcon from "material-ui/svg-icons/action/history";

class Pacts extends Component {
  state = {
    pacts: []
  };

  componentWillMount() {
    this.props.setAppBarTitle("Pacts");
    if (this.props.userData && this.props.userData.pacts) {
      this.getPacts(this.props.userData.pacts);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userData && nextProps.userData.pacts) {
      this.getPacts(nextProps.userData.pacts);
    }
  }

  getPacts = pactsObject => {
    const pactIds = Object.keys(pactsObject);
    const { pacts } = this.state;
    if (pactIds.length !== pacts.length) {
      this.setState({ pacts: [] });
      pactIds.forEach(pactId => {
        db.ref(`pacts/${pactId}`).once("value", snapshot => {
          const pactObject = { ...snapshot.val(), pactId };
          this.setState({ pacts: [...pacts, pactObject] });
        });
      });
    }
  };

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

    const pactCards = this.state.pacts.map(pact => (
      <PactCard key={pact.pactId} {...pact} />
    ));

    return (
      <div style={{ paddingTop: 72 }}>
        <Tabs style={{ position: "fixed", top: 64, zIndex: 2, width: "100%" }} secondary>
          <Tab icon={<RunIcon />} label="Active" />
          <Tab icon={<HistoryIcon />} label="Completed" />
        </Tabs>
        <div style={styles.pacts}>
          {/*<PactCard
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
        />*/}
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

export default connect(
  state => ({
    userData: state.auth.userData
  }),
  {
    setAppBarTitle
  }
)(withRouter(Pacts));
