import React from 'react';
import PropTypes from 'prop-types';
import SwaggerUI from 'swagger-ui-react';

import { BitbucketService, GitlabService } from 'src/js/services/sso-providers';

class SwaggerDisplay extends React.Component {

  static propTypes = {
    url: PropTypes.string
  };

  state = {};

  requestInterceptor(req) {
    return this.modifyRequest(req);
  }

  async modifyRequest(req) {
    if (req.loadSpec) {

      let service = null;
      if (BitbucketService.isBitbucketUrl(req.url)) {
        service = BitbucketService;
      } else if (GitlabService.isGitlabUrl(req.url)) {
        service = GitlabService;
      }

      if (service) {
        req.headers['Authorization'] = service.getHttpAuthHeader();
        req.url = await service.getRawContentUrl(req.url);
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

export {
  SwaggerDisplay
};
