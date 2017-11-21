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
import { auth } from "../Firebase";
import { withRouter } from "react-router";
import { openSidebar, closeSidebar } from "../store/reducers/ui";
import { userLoading } from "../store/reducers/auth";

class Header extends Component {
  logOut = async () => {
    this.props.userLoading();
    await auth.signOut();
    this.props.history.push("/");
    this.props.closeSidebar();
  };

  onSidebarChange = open => {
    open ? this.props.openSidebar() : this.props.closeSidebar();
  };

  toggleSidebar = () => {
    this.props.sidebarOpen
      ? this.props.closeSidebar()
      : this.props.openSidebar();
  };

  handleClose = () => {
    this.props.history.goBack();
  }

  handleClickPacts = () => this.props.history.push('/pacts');

  render() {
    const email = this.props.user && this.props.user.email;
    const firstLetter = email && email.charAt(0);

    const userListItem = (
      <ListItem
        primaryText={email}
        leftAvatar={<Avatar>{firstLetter}</Avatar>}
        rightIconButton={
          <IconButton onClick={this.logOut}>
            <CloseIcon />
          </IconButton>
        }
      />
    );

    const closeButton = this.props.closeButtonShown ? (
      <IconButton
        onClick={this.handleClose}
      >
        <CloseIcon />
      </IconButton>
    ) : null;

    return (
      <div>
        <AppBar
          title={this.props.title}
          onLeftIconButtonTouchTap={this.toggleSidebar}
          iconElementRight={closeButton}
        />
        <Drawer
          docked={false}
          open={this.props.sidebarOpen}
          onRequestChange={this.onSidebarChange}
        >
          <List>
            {this.props.user && userListItem}
          </List>
          <Divider />
          <List>
            <ListItem
              primaryText="Pacts"
              secondaryText="# pacts active"
              leftIcon={<PactsIcon />}
              onClick={this.handleClickPacts}
            />
          </List>
        </Drawer>
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      title: state.ui.appBarTitle,
      user: state.auth.user,
      sidebarOpen: state.ui.sidebarOpen,
      closeButtonShown: state.ui.closeButtonShown
    }),
    {
      openSidebar,
      closeSidebar,
      userLoading
    }
  )(Header)
);
