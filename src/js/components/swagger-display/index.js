import React from 'react';
import PropTypes from 'prop-types';
import SwaggerUI from 'swagger-ui-react';

import { connect } from 'react-redux';

import { UrlService } from 'src/js/services/url';
import { BitbucketService } from 'src/js/services/bitbucket';

class SwaggerDisplayComponent extends React.Component {

  static propTypes = {};

  state = {
    url: ''
  };

  componentDidMount() {
    const params = UrlService.getParams();
    const url = params.get('url');
    if (url && !this.needToAuthorize(url)) {
      this.setState({
        url
      });
    }
  }

  requestInterceptor(req) {
    if (req.loadSpec) {
      if (BitbucketService.isBitbucketUrl(req.url)) {
        req.headers['Authorization'] = `Bearer ${BitbucketService.accessToken}`;
        req.url = BitbucketService.getRawContentUrl(req.url);
      }
    }
    return req;
  }

  render() {
    return (
      <SwaggerUI
        url={this.state.url}
        requestInterceptor={req => this.requestInterceptor(req)}
      />
    );
  }

  needToAuthorize(url) {
    if (BitbucketService.isBitbucketUrl(url)) {
      return BitbucketService.authorize();
    }
    return false;
  }

}

const mapStateToProps = () => ({});

const SwaggerDisplay = connect(mapStateToProps)(SwaggerDisplayComponent);

export {
  SwaggerDisplay,
  SwaggerDisplayComponent
};
