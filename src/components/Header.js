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

  linkFromSidebar = (to) => {
    this.props.history.push(to);
    this.props.closeSidebar();
  }

  render() {
    const email = this.props.userData && this.props.userData.email;
    const displayName = this.props.userData && this.props.userData.displayName;
    const firstLetter = displayName ?
      displayName.charAt(0) :
      (email && email.charAt(0));

    const userListItem = (
      <ListItem
        primaryText={displayName || email}
        secondaryText={displayName ? email : null}
        leftAvatar={<Avatar>{firstLetter}</Avatar>}
        rightIconButton={
          <IconButton onClick={this.logOut}>
            <CloseIcon />
          </IconButton>
        }
      />
    );

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

    const sidebar = (
      <Drawer
        docked={false}
        open={this.props.sidebarOpen}
        onRequestChange={this.onSidebarChange}
      >
        <List>
          {userListItem}
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
          showMenuIconButton={this.props.user !== null}
          iconElementRight={this.props.closeButtonShown ? closeButton : null}
        />
        {this.props.user && sidebar}
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => ({
      title: state.ui.appBarTitle,
      user: state.auth.user,
      userData: state.auth.userData,
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
