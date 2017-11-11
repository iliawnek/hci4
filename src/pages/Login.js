import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setAppBarTitle} from '../store/reducers/ui';
import LoginForm from '../components/LoginForm';
import {withRouter} from 'react-router';

class Login extends Component {
  componentWillMount() {
    this.props.setAppBarTitle('Login');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.props.history.push('/pacts');
    }
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

export default withRouter(connect(state => ({
  user: state.auth.user,
}), {
  setAppBarTitle,
})(Login));
