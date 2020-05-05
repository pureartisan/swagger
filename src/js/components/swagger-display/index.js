import React from 'react';
import PropTypes from 'prop-types';
import SwaggerUI from 'swagger-ui-react';

import { connect } from 'react-redux';

import { BitbucketService } from 'src/js/services/bitbucket';

class SwaggerDisplayComponent extends React.Component {

  static propTypes = {
    url: PropTypes.string
  };

  state = {};

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
      <React.Fragment>
        {this.props.url && (
          <SwaggerUI
            url={this.props.url}
            requestInterceptor={req => this.requestInterceptor(req)}
          />
        )}
      </React.Fragment>
    );
  }

}

const mapStateToProps = () => ({});

const SwaggerDisplay = connect(mapStateToProps)(SwaggerDisplayComponent);

export {
  SwaggerDisplay,
  SwaggerDisplayComponent
};
