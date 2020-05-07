import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import { IconButton, Menu, MenuItem } from '@material-ui/core';

import './style.scss';

class SsoProviderButtonComponent extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    service: PropTypes.object,
    label: PropTypes.string
  };

  state = {
    anchorEl: null
  };

  handleLogoutClick = () => {
    this.props.service.clearAccessToken();
  }

  handleLoginClick = () => {
    this.props.service.authorize();
  }

  handleIconClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget
    });
  }

  handleMenuClose = () => {
    this.setState({
      anchorEl: null
    });
  }

  render() {
    const { service, className, label, ...props } = this.props;
    const active = service.accessToken;
    return (
      <React.Fragment>
        <IconButton
          {...props}
          className={classNames(className, { inactive: !active })}
          onClick={this.handleIconClick}
        />
        <Menu
          anchorEl={this.state.anchorEl}
          keepMounted
          open={Boolean(this.state.anchorEl)}
          onClose={this.handleMenuClose}
        >
          {active && (
            <MenuItem onClick={this.handleLogoutClick}>Logout of {label}</MenuItem>
          )}
          {!active && (
            <MenuItem onClick={this.handleLoginClick}>Log into {label}</MenuItem>
          )}
        </Menu>
      </React.Fragment>
    );
  }

}

const mapStateToProps = () => ({});

const SsoProviderButton = connect(mapStateToProps)(SsoProviderButtonComponent);

export {
  SsoProviderButton,
  SsoProviderButtonComponent
};
