import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from './pages/Login';
import Pacts from './pages/Pacts';

export default () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Login}/>
        <Route path="/pacts" component={Pacts}/>
      </div>
    </Router>
  );
};
