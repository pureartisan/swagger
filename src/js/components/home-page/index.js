import React from 'react';
import { connect } from 'react-redux';

import { CircularProgress } from '@material-ui/core';

import { UrlService } from 'src/js/services/url';
import { BitbucketService, GitlabService } from 'src/js/services/sso-providers';

import { SwaggerDisplay } from 'src/js/components/swagger-display';
import { MainForm } from 'src/js/components/main-form';
import { Footer } from 'src/js/components/footer';

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
    if (GitlabService.isGitlabUrl(url)) {
      return GitlabService.authorize();
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
          <React.Fragment>
            <MainForm />
            <Footer />
          </React.Fragment>
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
