import React, { Component } from "react";
import { connect } from "react-redux";
import AppBar from "material-ui/AppBar";
import Drawer from "material-ui/Drawer";
import { List, ListItem } from "material-ui/List";
import Avatar from "material-ui/Avatar";
import CloseIcon from "material-ui/svg-icons/navigation/close";
import IconButton from "material-ui/IconButton";
import Divider from "material-ui/Divider";
import PactsIcon from "material-ui/svg-icons/social/group";
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

  render() {
    const {uid, email, displayName} = this.props;

    const firstLetter = displayName ?
      displayName.charAt(0) :
      (email && email.charAt(0));

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
          onClick={this.linkFromSidebar.bind(this, to)}
        />
      )
    }

    const sidebar = this.props.menuButtonShown && (
      <Drawer
        docked={false}
        open={this.props.sidebarOpen}
        onRequestChange={this.onSidebarChange}
      >
        <List>
          {createSidebarLink({
            to: `/user/${uid}`,
            primaryText: displayName || email,
            secondaryText: displayName ? email : null,
            leftAvatar: <Avatar>{firstLetter}</Avatar>
          })}
        </List>
        <Divider/>
        <List>
          {createSidebarLink({
            to: '/pacts',
            primaryText: 'Pacts',
            secondaryText: '# pacts active',
            leftIcon: <PactsIcon/>,
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
