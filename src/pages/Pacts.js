import React, { Component } from "react";
import { compose } from 'redux';
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { setAppBarTitle } from "../store/reducers/ui";
import PactCard from "../components/PactCard";
import FloatingActionButton from "material-ui/FloatingActionButton";
import AddIcon from "material-ui/svg-icons/content/add";
import { withRouter } from "react-router";
import { Tabs, Tab } from "material-ui/Tabs";
import RunIcon from "material-ui/svg-icons/maps/directions-run";
import HistoryIcon from "material-ui/svg-icons/action/history";
import moment from 'moment';

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

  getCurrentWindow = (pact, pactId) => {
    const windows = this.props.windows && this.props.windows[pactId];
    const {today} = this.props;
    if (!windows || !today) return;
    for (let [windowId, window] of Object.entries(windows)) {
      const {startsOn, endsOn} = window;
      if (startsOn <= today && today < endsOn) {
        return {
          ...window,
          id: windowId,
        }
      }
    }
  }

  getPacts = () => {
    const {showEnded} = this.state;
    const {pacts, today, currentUid} = this.props;
    if (!pacts || !today || !currentUid) return;

    return Object.entries(pacts).filter(([pactId, pact]) => (
      pact.members[currentUid] && (showEnded ? pact.endsOn <= today : today < pact.endsOn)
    )).map(([pactId, pact]) => {
      const currentWindow = this.getCurrentWindow(pact, pactId);
      return {
        ...pact,
        id: pactId,
        currentWindow,
        currentWindowCompleted: currentWindow && currentWindow.completed && currentWindow.completed[currentUid],
        daysUntilCurrentWindowEnds: currentWindow && moment(currentWindow.endsOn).diff(today, 'days'),
        pactEnded: pact.endsOn <= today,
      }
    }).sort((a, b) => {
      if (!a.currentWindowCompleted && b.currentWindowCompleted) return -1
      if (a.currentWindowCompleted && !b.currentWindowCompleted) return 1
      if (a.endsOn < b.endsOn) return 1
      else return -1
    })
  }

  render() {
    const pacts = this.getPacts();

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

    const pactCards = pacts && pacts.map(pact => (
      <PactCard
        key={pact.id}
        pact={pact}
        pactId={pact.id}
        currentWindow={pact.currentWindow}
        currentWindowCompleted={pact.currentWindowCompleted}
        daysUntilCurrentWindowEnds={pact.daysUntilCurrentWindowEnds}
        pactEnded={pact.pactEnded}
      />
    ))

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

export default compose(
  connect(
    state => ({
      pacts: state.firebase.data.pacts,
      today: state.firebase.data.today,
      currentUid: state.firebase.auth.uid,
      windows: state.firebase.data.windows,
    }),
    {
      setAppBarTitle
    }
  ),
  withRouter,
  firebaseConnect()
)(Pacts)
