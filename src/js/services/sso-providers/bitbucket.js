import { BITBUCKET_CLIENT, BITBUCKET_ACCESS_TOKEN_TYPE } from 'src/js/config/bitbucket';

import { UrlService } from 'src/js/services/url';

import { AbstractSsoProviderService } from './abstract-sso-provider-service';

class BitbucketService extends AbstractSsoProviderService {

  /**
   * @override
   */
  getAccessTokenStorageKey() {
    return 'bitbucket-access-token';
  }

  /**
   * @override
   */
  getProviderName() {
    return 'bitbucket';
  }

  /**
   * @override
   */
  extractAccessToken(params) {
    const accessToken = params.get('access_token');
    const tokenType = params.get('token_type');
    const expiresIn = params.get('expires_in');
    if (
      accessToken &&
      tokenType &&
      tokenType.toLowerCase() === BITBUCKET_ACCESS_TOKEN_TYPE
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
    return UrlService.buildUrl('https://bitbucket.org/site/oauth2/authorize', {
      'client_id': BITBUCKET_CLIENT,
      'response_type': 'token'
    });
  }

  /**
   * @override
   */
  async getRawContentUrl(url) {
    const path = url.replace(/^https?:\/\/bitbucket\.org\//i, '');
    return `https://api.bitbucket.org/2.0/repositories/${path}`;
  }

  isBitbucketUrl(url) {
    if (!url) {
      return false;
    }
    return url.match(/^https?:\/\/bitbucket\.org\/.*/i);
  }

}

const singleton = new BitbucketService();

export {
  singleton as BitbucketService
};