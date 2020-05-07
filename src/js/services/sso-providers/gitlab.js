import axios from 'axios';

import { GITLAB_CLIENT, GITLAB_ACCESS_TOKEN_TYPE } from 'src/js/config/gitlab';

import { UrlService } from 'src/js/services/url';

import { AbstractSsoProviderService } from './abstract-sso-provider-service';

const GITLAB_API_BASE = 'https://gitlab.com/api/v4';

class GitlabService extends AbstractSsoProviderService {

  /**
   * @override
   */
  getAccessTokenStorageKey() {
    return 'gitlab-access-token';
  }

  /**
   * @override
   */
  getProviderName() {
    return 'gitlab';
  }

  /**
   * @override
   */
  extractAccessToken(params) {
    const accessToken = params.get('access_token');
    const tokenType = params.get('token_type');
    const expiresIn = params.get('expires_in');
    const state = params.get('state');
    if (
      accessToken &&
      tokenType &&
      tokenType.toLowerCase() === GITLAB_ACCESS_TOKEN_TYPE &&
      state === this.authVerificationToken
    ) {
      return {
        accessToken,
        expiresIn
      };
    }
    return null;
  }

  /**
   * @override
   */
  buildAuthorizeUrl() {
    return UrlService.buildUrl('https://gitlab.com/oauth/authorize', {
      'client_id': GITLAB_CLIENT,
      'redirect_uri': UrlService.getAppUrl({ 'auth': this.getProviderName() }),
      'response_type': 'token',
      'state': this.authVerificationToken
    });
  }

  /**
   * @override
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

  isGitlabUrl(url) {
    if (!url) {
      return false;
    }
    return url.match(/^https?:\/\/gitlab\.com\/.*/i);
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

  async getProjectId(projectPath) {
    const parts = projectPath.split('/');
    let projectName = projectPath;
    if (parts.length > 1) {
      projectName = parts[1];
    }
    const apiUrl = `${GITLAB_API_BASE}/projects`;
    const result = await axios.get(apiUrl, {
      ...this.getApiRequestDefaultConfig(),
      url: '/projects',
      method: 'get',
      params: {
        search: projectName,
        simple: true
      }
    });
    if (result && result.data && result.data.length > 0) {
      const project = result.data.find(({ path_with_namespace }) => path_with_namespace === projectPath);
      if (project && project.id) {
        return project.id;
      }
    }
    return projectName;
  }

}

const singleton = new GitlabService();

export {
  singleton as GitlabService
};