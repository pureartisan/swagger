import React from 'react';
import PropTypes from 'prop-types';

import { SwaggerDisplay } from 'src/js/components/swagger-display';

class AppEntry extends React.Component {

  static propTypes = {};

  state = {};

  render() {
    return (
      <SwaggerDisplay />
    );
  }

}

export {
  AppEntry
};
