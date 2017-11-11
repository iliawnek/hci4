import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {auth} from '../Firebase';

class LoginForm extends Component {
  state = {
    email: '',
    password: '',
  };

  register = () => {
    auth.createUserWithEmailAndPassword(this.state.email, this.state.password);
  }

  login = () => {
    auth.signInWithEmailAndPassword(this.state.email, this.state.password);
  }

  render() {
    const styles = {
      loginForm: {
        width: 256,
      },
      loginButtons: {
        marginTop: 20,
        display: 'flex',
        justifyContent: 'space-between',
      },
    };

    return (
      <div style={styles.loginForm}>
        <TextField
          hintText="Email address"
          value={this.state.email}
          onChange={(event) => this.setState({email: event.target.value})}
        />
        <TextField
          type="password"
          hintText="Password"
          value={this.state.password}
          onChange={(event) => this.setState({password: event.target.value})}
        />
        <div style={styles.loginButtons}>
          <RaisedButton
            label="Register"
            secondary
            onClick={this.register}
          />
          <RaisedButton
            label="Login"
            primary
            onClick={this.login}
          />
        </div>
      </div>
    );
  }
}

export default LoginForm;