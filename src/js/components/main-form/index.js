import React from 'react';

import { CssBaseline, Container, TextField, Button} from '@material-ui/core';
import { Link as LinkIcon } from '@material-ui/icons';

import { UrlService } from 'src/js/services/url';
import { BitbucketService, GitlabService } from 'src/js/services/sso-providers';

import { UrlDisplay } from 'src/js/components/url-display';

import './style.scss';

class MainForm extends React.Component {

  static propTypes = {};

  state = {
    input: '',
    url: null
  };

  needToAuthorize(url) {
    if (BitbucketService.isBitbucketUrl(url)) {
      return BitbucketService.authorize();
    }
    if (GitlabService.isGitlabUrl(url)) {
      return GitlabService.authorize();
    }
    return false;
  }

  generateUrl() {
    if (this.state.input) {
      const url = UrlService.getAppUrl({
        url: this.state.input
      });
      if (url) {
        this.setState({
          url
        });
      }
    } else {
      this.setState({
        url: ''
      });
    }
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    this.generateUrl();
  }

  handleInputChange = ({ target: {value}}) => {
    this.setState({
      input: (value || '').trim()
    });
  }

  handleGenerateButtonClick = () => {
    this.generateUrl();
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <div className="main-form">
            <h1>Swagger Visualizer</h1>
            <form noValidate autoComplete="off" onSubmit={this.handleFormSubmit}>
              <TextField
                className="input"
                placeholder="Enter YAML or JSON url for Swagger/OAS"
                variant="outlined"
                autoFocus={true}
                onChange={this.handleInputChange}
              />
              <Button
                variant="contained"
                color="primary"
                className="generate-button"
                disabled={!this.state.input}
                onClick={this.handleGenerateButtonClick}
                startIcon={<LinkIcon />}
              >Generate URL</Button>
            </form>
            <UrlDisplay url={this.state.url} />
          </div>
        </Container>
      </React.Fragment>
    );
  }

}

export {
  MainForm
};
