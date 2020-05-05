import React from 'react';
import { connect } from 'react-redux';

import { CircularProgress } from '@material-ui/core';

import { UrlService } from 'src/js/services/url';
import { BitbucketService } from 'src/js/services/bitbucket';

import { SwaggerDisplay } from 'src/js/components/swagger-display';
import { MainForm } from 'src/js/components/main-form';

import './style.scss';

class HomePageComponent extends React.Component {

  static propTypes = {};

  state = {
    busy: true,
    showForm: false,
    url: ''
  };

  componentDidMount() {
    const params = UrlService.getParams();
    const url = params.get('url');
    const auth = params.get('auth');
    if (url && !this.needToAuthorize(url)) {
      this.setState({
        url,
        busy: false
      });
    }
    if (!url && !auth) {
      this.setState({
        showForm: true,
        busy: false
      });
    }
  }

  needToAuthorize(url) {
    if (BitbucketService.isBitbucketUrl(url)) {
      return BitbucketService.authorize();
    }
    return false;
  }

  render() {
    return (
      <React.Fragment>
        {this.state.busy && (
          <div className="busy">
            <CircularProgress />
          </div>
        )}
        {this.state.url && (
          <SwaggerDisplay url={this.state.url} />
        )}
        {this.state.showForm && (
          <MainForm />
        )}
      </React.Fragment>
    );
  }

}

const mapStateToProps = () => ({});

const HomePage = connect(mapStateToProps)(HomePageComponent);

export {
  HomePage,
  HomePageComponent
};
