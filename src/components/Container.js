import React, { Component } from "react";
import Header from "./Header";
import { grey100 } from "material-ui/styles/colors";

class Container extends Component {
  render() {
    const styles = {
      content: {
        position: "absolute",
        top: 64,
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
          <Header />
          <div style={styles.content}>
            {this.props.children}
          </div>
        </div>
    );
  }
}

export default Container;
