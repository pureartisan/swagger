import React from 'react';
import PropTypes from 'prop-types';
import SwaggerUI from 'swagger-ui-react';

import { BitbucketService, GitlabService } from 'src/js/services/sso-providers';

class SwaggerDisplay extends React.Component {

  static propTypes = {
    url: PropTypes.string
  };

  state = {};

  expandModels() {
    const swaggerUi = document.querySelector('.swagger-ui');
    if (swaggerUi) {
      const modelHeaders = swaggerUi.querySelectorAll(
        '.model-container > .model-box > span:not(.model-box):first-of-type'
      );
      if (modelHeaders) {
        modelHeaders.forEach(item => item.click());
      }
    }
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

  requestInterceptor(req) {
    return this.modifyRequest(req);
  }

  handleComplete() {
    this.expandModels();
  }

  render() {
    return (
      <React.Fragment>
        {this.props.url && (
          <SwaggerUI
            docExpansion="full"
            url={this.props.url}
            requestInterceptor={req => this.requestInterceptor(req)}
            onComplete={system => this.handleComplete(system)}
          />
        )}
      </React.Fragment>
    );
  }

}

export {
  SwaggerDisplay
};
