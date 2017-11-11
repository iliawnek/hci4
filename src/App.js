import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Router from './Router';
import {Provider} from 'react-redux';
import store from './store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider>
            <Router/>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

export default App;