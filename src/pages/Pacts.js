import React, { Component } from 'react';
import Container from '../components/Container';
import {connect} from 'react-redux';
import {setAppBarTitle} from '../store/reducers/ui';

class Pacts extends Component {
  componentWillMount() {
    this.props.setAppBarTitle('Pacts');
  }

  render() {
    return (
      <Container/>
    );
  }
}

export default connect(null, {
  setAppBarTitle,
})(Pacts);
