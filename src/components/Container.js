import React, { Component } from "react";
import { Route } from "react-router-dom";
import Login from "../pages/Login";
import Setup from "../pages/Setup";
// import Pacts from "../pages/Pacts";
// import CreatePact from '../pages/CreatePact'
// import User from "../pages/User";
// import Pact from "../pages/Pact";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./Header";
import { grey100 } from "material-ui/styles/colors";

class Container extends Component {
  render() {
    const styles = {
      content: {
        position: "absolute",
        top: 64,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: grey100,
        overflowY: "auto",
        overflowX: "hidden"
      }
    };

    return (
      <Router>
        <div>
          <Header />
          <div style={styles.content}>
            <Route exact path="/" component={Login} />
            <Route path="/setup" component={Setup} />
            {/*<Route path="/pacts" component={Pacts} />*/}
            {/*<Route path="/create-pact" component={CreatePact} />*/}
            {/*<Route path="/user/:uid" component={User} />*/}
            {/*<Route path="/pact/:pactId" component={Pact} />*/}
          </div>
        </div>
      </Router>
    );
  }
}

export default Container;
