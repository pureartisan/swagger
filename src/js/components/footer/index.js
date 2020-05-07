import React from 'react';
import { connect } from 'react-redux';

import { AppBar, Toolbar } from '@material-ui/core';

import { BitbucketIcon, GitlabIcon } from 'src/js/components/icons';
import { SsoProviderButton } from 'src/js/components/sso-provider-button';

import { BitbucketService, GitlabService } from 'src/js/services/sso-providers';

import './style.scss';

class FooterComponent extends React.Component {

  static propTypes = {};

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
            service={GitlabService}
            label="Gitlab"
          >
            <GitlabIcon />
          </SsoProviderButton>

          <SsoProviderButton
            edge="end"
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

const mapStateToProps = () => ({});

const Footer = connect(mapStateToProps)(FooterComponent);

export {
  Footer,
  FooterComponent
};
