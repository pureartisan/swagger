import React from 'react';
import PropTypes from 'prop-types';
import SwaggerUI from 'swagger-ui-react';

import { connect } from 'react-redux';

import { UrlService } from 'src/js/services/url';

class SwaggerDisplayComponent extends React.Component {

  static propTypes = {};

  state = {
    url: ''
  };

  componentDidMount() {
    const params = UrlService.getParamsFromHash();
    const url = params.get('url');
    if (url) {
      this.setState({
        url
      });
    }
  }

  render() {
    return (
      <SwaggerUI url={this.state.url} />
    );
  }

}

const mapStateToProps = () => ({});

const SwaggerDisplay = connect(mapStateToProps)(SwaggerDisplayComponent);

export {
  SwaggerDisplay,
  SwaggerDisplayComponent
};
