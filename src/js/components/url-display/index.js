import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Button, Card, CardActions, CardContent, Fade, Snackbar } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';

import { DeviceService } from 'src/js/services/device';

import './style.scss';

const Alert = (props) => (
  <MuiAlert elevation={6} variant="filled" {...props} />
);

class UrlDisplay extends React.Component {

  static propTypes = {
    url: PropTypes.string
  };

  state = {
    copyText: 'Ctrl + C',
    url: ''
  };

  componentDidMount() {
    if (DeviceService.isMac()) {
      this.setState({
        copyText: '⌘ + C'
      });
    }
  }

  handleCopyClick = ({ target: {value}}) => {
    this.setState({
      input: (value || '').trim()
    });
  }

  handleClipboardCopied = (text, result) => {
    this.setState({
      copied: result
    });
  }

  handleSnackbarClosed = () => {
    this.setState({
      copied: false
    });
  }

  render() {
    return (
      <React.Fragment>
        <Fade in={Boolean(this.props.url)}>
          <Card className="url-display">
            <CardContent>
              <span className="url">{this.props.url}</span>
            </CardContent>
            <CardActions className="card-actions">
              <CopyToClipboard
                text={this.props.url}
                onCopy={this.handleClipboardCopied}
              >
                <Button variant="contained">
                  Copy ({this.state.copyText})
                </Button>
              </CopyToClipboard>
            </CardActions>
          </Card>
        </Fade>
        <Snackbar
          open={this.state.copied}
          autoHideDuration={6000}
          onClose={this.handleSnackbarClosed}
        >
          <Alert onClose={this.handleSnackbarClosed} severity="success">
            URL copied to clipboard
          </Alert>
        </Snackbar>
      </React.Fragment>

    );
  }

}

export {
  UrlDisplay
};
