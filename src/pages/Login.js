import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setAppBarTitle} from '../store/reducers/ui';
import Container from '../components/Container';

class App extends Component {
  componentWillMount() {
    this.props.setAppBarTitle('Login');
  }

  render() {
    return (
      <Container>
      </Container>
    );
  }
}

export default connect(null, {
  setAppBarTitle,
})(App);
