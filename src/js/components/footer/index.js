import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { AppBar, Toolbar } from '@material-ui/core';

import { BitbucketIcon, GitlabIcon } from 'src/js/components/icons';
import { SsoProviderButton } from 'src/js/components/sso-provider-button';

import { BitbucketService, GitlabService } from 'src/js/services/sso-providers';

import './style.scss';

class FooterComponent extends React.Component {

  static propTypes = {
    sso: PropTypes.object
  };

  state = {};

  handleIconClick = (service) => {
    service.clearAccessToken();
  }

  render() {
    return (
      <AppBar position="fixed" color="primary" className="main-footer">
        <Toolbar>

          <SsoProviderButton
            edge="start"
            active={this.props.sso[GitlabService.getProviderName()]}
            service={GitlabService}
            label="Gitlab"
          >
            <GitlabIcon />
          </SsoProviderButton>

          <SsoProviderButton
            edge="end"
            active={this.props.sso[BitbucketService.getProviderName()]}
            service={BitbucketService}
            label="Bitbucket"
          >
            <BitbucketIcon />
          </SsoProviderButton>

        </Toolbar>
      </AppBar>
    );
  }

}

const mapStateToProps = state => ({
  sso: state.sso
});

const Footer = connect(mapStateToProps)(FooterComponent);

export {
  Footer,
  FooterComponent
};
