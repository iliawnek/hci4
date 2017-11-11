import React, {Component} from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import {auth} from '../Firebase';
import {withRouter} from 'react-router-dom';
import {openSidebar, closeSidebar} from '../store/reducers/ui';
import {userLoading} from '../store/reducers/auth';

class Header extends Component {
  logOut = async () => {
    this.props.userLoading();
    await auth.signOut();
    this.props.history.push('/');
    this.props.closeSidebar();
  }

  onSidebarChange = open => {
    open ?
      this.props.openSidebar() :
      this.props.closeSidebar();
  }

  toggleSidebar = () => {
    this.props.sidebarOpen ?
      this.props.closeSidebar() :
      this.props.openSidebar();
  }

  render() {
    const email = this.props.user && this.props.user.email;
    const firstLetter = email && email.charAt(0);

    const userListItem = (
      <ListItem
        primaryText={email}
        leftAvatar={<Avatar>{firstLetter}</Avatar>}
        rightIconButton={
          <IconButton
            onClick={this.logOut}
          >
            <CloseIcon/>
          </IconButton>}
      />
    )

    return (
      <div>
        <AppBar
          title={this.props.title}
          onLeftIconButtonTouchTap={this.toggleSidebar}
        />
        <Drawer
          docked={false}
          open={this.props.sidebarOpen}
          onRequestChange={this.onSidebarChange}
        >
          <List>
            {this.props.user && userListItem}
          </List>
        </Drawer>
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  title: state.ui.appBarTitle,
  user: state.auth.user,
  sidebarOpen: state.ui.sidebarOpen,
}), {
  openSidebar,
  closeSidebar,
  userLoading,
})(Header));