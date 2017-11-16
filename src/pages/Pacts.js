import React, { Component } from "react";
import { connect } from "react-redux";
import { setAppBarTitle } from "../store/reducers/ui";
import PactCard from "../components/PactCard";

class Pacts extends Component {
  componentWillMount() {
    this.props.setAppBarTitle("Pacts");
  }

  render() {
    return (
      <div>
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
      </div>
    );
  }
}

export default connect(null, {
  setAppBarTitle
})(Pacts);
