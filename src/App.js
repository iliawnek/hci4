import React, { Component } from "react";
import "./App.css";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";
import Routes from './components/Routes';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <MuiThemeProvider>
            <Routes/>
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
