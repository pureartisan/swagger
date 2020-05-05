import { BITBUCKET_CLIENT, BITBUCKET_ACCESS_TOKEN_TYPE } from 'src/js/config/bitbucket';

import { StorageService } from 'src/js/services/storage';
import { UrlService } from 'src/js/services/url';

const STORAGE_KEY_ACCESS_TOKEN = 'bitbucket-access-token';
const STORAGE_KEY_REDIRECT = 'bitbucket-redirect';

const AUTH_PROVIDER = 'bitbucket';

class BitbucketService {

  accessToken = null;

  init() {
    this.accessToken = StorageService.cookieGet(STORAGE_KEY_ACCESS_TOKEN);
    this.readAccessToken();
  }

  authorize() {
    if (!this.accessToken) {
      StorageService.sessionSet(STORAGE_KEY_REDIRECT, window.location.href);
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
        if (accessToken && tokenType === BITBUCKET_ACCESS_TOKEN_TYPE) {
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
    return UrlService.buildUrl('https://bitbucket.org/site/oauth2/authorize', {
      'client_id': BITBUCKET_CLIENT,
      'response_type': 'token'
    });
  }

  isBitbucketUrl(url) {
    if (!url) {
      return false;
    }
    return url.match(/^https?:\/\/bitbucket\.org\/.*/i);
  }

  getHttpAuthHeader() {
    return `Bearer ${this.accessToken}`;
  }

  async getRawContentUrl(url) {
    const path = url.replace(/^https?:\/\/bitbucket\.org\//i, '');
    return `https://api.bitbucket.org/2.0/repositories/${path}`;
  }

}

const singleton = new BitbucketService();

export {
  singleton as BitbucketService
};