import React from 'react';
import PropTypes from 'prop-types';
import SwaggerUI from 'swagger-ui-react';

import { connect } from 'react-redux';

const sampleFile = 'https://raw.githubusercontent.com/swagger-api/swagger-samples/master/java/inflector-dropwizard/src/main/swagger/swagger.yaml';

class SwaggerDisplayComponent extends React.Component {

  static propTypes = {};

  state = {};

  render() {
    return (
      <SwaggerUI url={sampleFile} />
    );
  }

}

const mapStateToProps = () => ({});

const SwaggerDisplay = connect(mapStateToProps)(SwaggerDisplayComponent);

export {
  SwaggerDisplay,
  SwaggerDisplayComponent
};
