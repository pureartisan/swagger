import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { GITLAB_CLIENT, GITLAB_ACCESS_TOKEN_TYPE } from 'src/js/config/gitlab';

import { StorageService } from 'src/js/services/storage';
import { UrlService } from 'src/js/services/url';

const STORAGE_KEY_ACCESS_TOKEN = 'gitlab-access-token';
const STORAGE_KEY_REDIRECT = 'gitlab-redirect';
const STORAGE_KEY_AUTH_VERIFICATION = 'gitlab-auth-verfication';

const AUTH_PROVIDER = 'gitlab';
const GITLAB_API_BASE = 'https://gitlab.com/api/v4';

class GitlabService {

  accessToken = null;

  authVerificationToken = null;

  init() {
    this.accessToken = StorageService.cookieGet(STORAGE_KEY_ACCESS_TOKEN);
    this.authVerificationToken = StorageService.sessionGet(STORAGE_KEY_AUTH_VERIFICATION);
    this.readAccessToken();
  }

  authorize() {
    if (!this.accessToken) {
      StorageService.sessionSet(STORAGE_KEY_REDIRECT, window.location.href);
      this.refreshAuthVerficationToken();
      window.location.href = this.buildAuthorizeUrl();
      return true;
    }
    return false;
  }

  readAccessToken(force = false) {
    if (force || !this.accessToken) {
      const params = UrlService.getParams();
      const auth = params.get('auth');
      if (auth === AUTH_PROVIDER) {
        const hashParams = UrlService.getParamsFromHash();
        const accessToken = hashParams.get('access_token');
        const tokenType = hashParams.get('token_type');
        const expiresIn = hashParams.get('expires_in');
        const state = hashParams.get('state');
        if (
          accessToken &&
          tokenType &&
          tokenType.toLowerCase() === GITLAB_ACCESS_TOKEN_TYPE &&
          state === this.authVerificationToken
        ) {
          this.accessToken = accessToken;
          const options = {};
          if (expiresIn > 0) {
            options.expires = new Date(new Date().getTime() + expiresIn * 1000);
          }
          StorageService.cookieSet(STORAGE_KEY_ACCESS_TOKEN, accessToken, options);
          this.redirectToPrevUrl();
        }
      }
    }
  }

  redirectToPrevUrl() {
    const redirect = StorageService.sessionGet(STORAGE_KEY_REDIRECT);
    if (redirect) {
      StorageService.sessionRemove(STORAGE_KEY_REDIRECT);
      window.location.href = redirect;
    }
  }

  buildAuthorizeUrl() {
    return UrlService.buildUrl('https://gitlab.com/oauth/authorize', {
      'client_id': GITLAB_CLIENT,
      'redirect_uri': UrlService.getAppUrl({ 'auth': AUTH_PROVIDER }),
      'response_type': 'token',
      'state': this.authVerificationToken
    });
  }

  refreshAuthVerficationToken() {
    this.authVerificationToken = uuidv4();
    StorageService.sessionSet(STORAGE_KEY_AUTH_VERIFICATION, this.authVerificationToken);
  }

  isGitlabUrl(url) {
    if (!url) {
      return false;
    }
    return url.match(/^https?:\/\/gitlab\.com\/.*/i);
  }

  getHttpAuthHeader() {
    return `Bearer ${this.accessToken}`;
  }

  getApiRequestDefaultConfig() {
    return {
      baseURL: GITLAB_API_BASE,
      responseType: 'json',
      headers: {
        'Authorization': this.getHttpAuthHeader()
      }
    }
  }

  async getProjectId(projectName) {
    const apiUrl = `${GITLAB_API_BASE}/projects`;
    console.log('apiUrl', apiUrl)
    const result = await axios.get(apiUrl, {
      ...this.getApiRequestDefaultConfig(),
      url: '/projects',
      method: 'get',
      params: {
        search: projectName,
        simple: true
      }
    });
    console.log('result', result);
    if (result && result.length > 0) {
      return result[0].id;
    }
    return projectName;
  }

  /**
   * https://docs.gitlab.com/ee/api/repository_files.html
   */
  async getRawContentUrl(url) {
    const path = url.replace(/^https?:\/\/gitlab\.com\//i, '');

    const matches = /(.+)\/-\/(blob|raw)\/([^/]+)\/(.+)/g.exec(path);
    if (matches) {
      const project = matches[1];
      const branch = matches[3];
      const file = matches[4];

      const projectId = await this.getProjectId(project);
      const base = `${GITLAB_API_BASE}/projects/${projectId}/repository/files/${file}/raw`;
      return UrlService.buildUrl(base, {
        'ref': branch
      });
    }

    return url;
  }

}

const singleton = new GitlabService();

export {
  singleton as GitlabService
};