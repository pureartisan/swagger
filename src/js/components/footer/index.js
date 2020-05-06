import React from 'react';
import { connect } from 'react-redux';

import { AppBar, Toolbar, IconButton } from '@material-ui/core';

import { BitbucketIcon, GitlabIcon } from 'src/js/components/icons';

import { BitbucketService } from 'src/js/services/bitbucket';
import { GitlabService } from 'src/js/services/gitlab';

import './style.scss';

class FooterComponent extends React.Component {

  static propTypes = {};

  state = {};

  handleIconClick = (service) => {
    service.clearAccessToken();
  }

  render() {
    return (
      <AppBar position="fixed" color="primary" className="footer">
        <Toolbar>

          {GitlabService.accessToken && (
            <IconButton
              edge="start"
              onClick={() => this.handleIconClick(GitlabService)}
            >
              <GitlabIcon />
            </IconButton>
          )}

          {BitbucketService.accessToken && (
            <IconButton
              edge="end"
              onClick={() => this.handleIconClick(BitbucketService)}
            >
              <BitbucketIcon />
            </IconButton>
          )}

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
