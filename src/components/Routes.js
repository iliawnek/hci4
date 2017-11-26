import React, { Component } from "react";
import "../App.css";
import Container from "./Container";
import { Route } from "react-router-dom";

import Login from "../pages/Login";
import Setup from "../pages/Setup";
import Pacts from "../pages/Pacts";
import CreatePact from '../pages/CreatePact'
import User from "../pages/User";
import Pact from "../pages/Pact";
import Run from "../pages/Run";
import ControlPanel from "../pages/ControlPanel";

class Routes extends Component {
  render() {
    return (
      <Container>
        <Route exact path="/" component={Login} />
        <Route path="/setup" component={Setup} />
        <Route path="/pacts" component={Pacts} />
        <Route path="/create-pact" component={CreatePact} />
        <Route path="/user/:uid" component={User} />
        <Route exact path="/pact/:pactId" component={Pact} />
        <Route exact path="/pact/:pactId/run/:windowId" component={Run} />
        <Route path="/control-panel" component={ControlPanel} />
      </Container>
    );
  }
}

export default Routes;
