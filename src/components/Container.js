import React, { Component } from "react";
import Header from "./Header";
import { grey100 } from "material-ui/styles/colors";
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { compose } from 'redux';

class Container extends Component {
  render() {
    const {appBarShown} = this.props;

    const styles = {
      content: {
        position: "absolute",
        top: appBarShown ? 64 : 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: grey100,
        overflowY: "auto",
        overflowX: "hidden"
      }
    };

    return (
        <div>
          {appBarShown && <Header />}
          <div style={styles.content}>
            {this.props.children}
          </div>
        </div>
    );
  }
}

export default compose(
  connect(
    (state) => ({
      appBarShown: state.ui.appBarShown,
    })
  ),
  firebaseConnect([
    'today',
    'users',
    'windows',
    'pacts',
  ])
)(Container);
