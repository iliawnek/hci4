import React, { Component } from 'react';
import {connect} from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import {auth} from '../Firebase';
import {setUser} from '../store/reducers/auth';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Login from '../pages/Login';
import Pacts from '../pages/Pacts';

class Container extends Component {
  state = {
    open: false,
  }

  componentWillMount() {
    auth.onAuthStateChanged(user => {
      this.props.setUser(user);
    })
  }

  toggleDrawer = () => {
    this.setState({open: !this.state.open});
  }

  logOut = () => {
    auth.signOut();
  }

  render() {
    const email = this.props.user && this.props.user.email;
    const firstLetter = email && email.charAt(0);

    const styles = {
      content: {
        height: 'calc(100vh - 64px)',
      },
    }

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
          onLeftIconButtonTouchTap={this.toggleDrawer}
        />
        <Drawer
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({open})}
        >
          <List>
            {this.props.user && userListItem}
          </List>
        </Drawer>
        <Router>
          <div style={styles.content}>
            <Route exact path="/" component={Login}/>
            <Route path="/pacts" component={Pacts}/>
          </div>
        </Router>
      </div>
    );
  }
}

export default connect(state => ({
  title: state.ui.appBarTitle,
  user: state.auth.user,
}), {
  setUser,
})(Container);
