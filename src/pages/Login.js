import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setAppBarTitle} from '../store/reducers/ui';
import LoginForm from '../components/LoginForm';

class App extends Component {
  componentWillMount() {
    this.props.setAppBarTitle('Login');
  }

  render() {
    const styles = {
      login: {
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    }

    return (
      <div style={styles.login}>
        <LoginForm/>
      </div>
    );
  }
}

export default connect(null, {
  setAppBarTitle,
})(App);
