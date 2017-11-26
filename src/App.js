import React, { Component } from "react";
import "./App.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Container from "./components/Container";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";

import Login from "./pages/Login";
import Setup from "./pages/Setup";
import Pacts from "./pages/Pacts";
import CreatePact from './pages/CreatePact'
import User from "./pages/User";
import Pact from "./pages/Pact";
import Run from "./pages/Run";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <MuiThemeProvider>
            <Container>
              <Route exact path="/" component={Login} />
              <Route path="/setup" component={Setup} />
              <Route path="/pacts" component={Pacts} />
              <Route path="/create-pact" component={CreatePact} />
              <Route path="/user/:uid" component={User} />
              <Route exact path="/pact/:pactId" component={Pact} />
              <Route exact path="/pact/:pactId/run/:windowId" component={Run} />
            </Container>
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
