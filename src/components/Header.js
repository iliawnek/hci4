import React, { Component } from "react";
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import { List, ListItem } from "material-ui/List";
import CloseIcon from "material-ui/svg-icons/navigation/close";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";
import RunIcon from "material-ui/svg-icons/maps/directions-run";
import MoreIcon from "material-ui/svg-icons/navigation/more-vert";
import { withRouter } from "react-router";
import { openSidebar, closeSidebar } from "../store/reducers/ui";
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

class Header extends Component {
  onSidebarChange = open => {
    open ? this.props.openSidebar() : this.props.closeSidebar();
  };

  toggleSidebar = () => {
    this.props.sidebarOpen
      ? this.props.closeSidebar()
      : this.props.openSidebar();
  };

  handleClose = () => {
    this.props.history.push(this.props.closeTo);
  }

  linkFromSidebar = (to) => {
    this.props.history.push(to);
    this.props.closeSidebar();
  }

  signOut = () => {
    this.props.firebase.auth().signOut();
    this.props.closeSidebar();
    this.props.history.push('/');
    window.location.reload();
  }

  render() {
    const {uid, email, displayName} = this.props;

    const closeButton = (
      <IconButton
        onClick={this.handleClose}
      >
        <CloseIcon />
      </IconButton>
    );

    const createSidebarLink = (props) => {
      const {to, ...listItemProps} = props;
      return (
        <ListItem
          {...listItemProps}
          onClick={to && this.linkFromSidebar.bind(this, to)}
        />
      )
    }

    const signOutMenuButton = (
      <IconMenu iconButtonElement={(
        <IconButton><MoreIcon/></IconButton>
      )}>
        <MenuItem onClick={this.signOut}>Sign out</MenuItem>
      </IconMenu>
    )

    const sidebar = this.props.menuButtonShown && (
      <Drawer
        docked={false}
        open={this.props.sidebarOpen}
        onRequestChange={this.onSidebarChange}
      >
        <List>
          {createSidebarLink({
            primaryText: displayName || email,
            secondaryText: displayName ? email : null,
            rightIconButton: (signOutMenuButton)
          })}
        </List>
        <Divider/>
        <List>
          {createSidebarLink({
            to: '/pacts',
            primaryText: 'Pacts',
            secondaryText: '# pacts active',
            leftIcon: <RunIcon/>,
          })}
        </List>
      </Drawer>
    )

    return (
      <div>
        <AppBar
          title={this.props.title}
          onLeftIconButtonTouchTap={this.toggleSidebar}
          showMenuIconButton={this.props.menuButtonShown}
          iconElementRight={this.props.closeButtonShown ? closeButton : null}
        />
        {uid && sidebar}
      </div>
    );
  }
}

export default compose(
  connect(
    state => ({
      title: state.ui.appBarTitle,
      sidebarOpen: state.ui.sidebarOpen,
      closeButtonShown: state.ui.closeButtonShown,
      closeTo: state.ui.closeTo,
      uid: state.firebase.auth && state.firebase.auth.uid,
      email: state.firebase.auth && state.firebase.auth.email,
      displayName: state.firebase.profile && state.firebase.profile.displayName,
      menuButtonShown: state.ui.menuButtonShown,
    }),
    {
      openSidebar,
      closeSidebar
    }
  ),
  withRouter,
  firebaseConnect()
)(Header);
