import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setAppBarTitle} from '../store/reducers/ui';

class Pacts extends Component {
  componentWillMount() {
    this.props.setAppBarTitle('Pacts');
  }

  render() {
    return (
      <div/>
    );
  }
}

export default connect(null, {
  setAppBarTitle,
})(Pacts);
