import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from '../Firebase';
import {userLoading, userLoaded, setUser} from '../store/reducers/auth';
import {Route} from 'react-router-dom';
import Login from '../pages/Login';
import Pacts from '../pages/Pacts';
import {BrowserRouter as Router} from 'react-router-dom';
import Header from './Header';

class Container extends Component {

  componentWillMount() {
    this.props.userLoading();
    auth.onAuthStateChanged(user => {
      this.props.userLoaded();
      this.props.setUser(user);
    })
  }

  render() {
    const styles = {
      content: {
        height: 'calc(100vh - 64px)',
      },
    }

    return (
      <Router>
        <div>
          <Header/>
          <div style={styles.content}>
            <Route exact path="/" component={Login}/>
            <Route path="/pacts" component={Pacts}/>
          </div>
        </div>
      </Router>
    );
  }
}

export default connect(null, {
  userLoading,
  userLoaded,
  setUser,
})(Container);
