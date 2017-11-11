import React, { Component } from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';

class Container extends Component {
  render() {
    return (
      <div>
        <AppBar title={this.props.title}/>
        {this.props.children}
      </div>
    );
  }
}

export default connect(state => ({
  title: state.ui.appBarTitle,
}))(Container);
