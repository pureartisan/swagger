import { v4 as uuidv4 } from 'uuid';

import { StorageService } from 'src/js/services/storage';
import { UrlService } from 'src/js/services/url';

const STORAGE_KEY_REDIRECT = 'sso-redirect';
const STORAGE_KEY_AUTH_VERIFICATION = 'sso-auth-verfication';

class AbstractSsoProviderService {

  accessToken = null;

  authVerificationToken = null;

  getAccessTokenStorageKey() {
    throw Error('abstract method');
  }

  getProviderName() {
    throw Error('abstract method');
  }

  buildAuthorizeUrl() {
    throw Error('abstract method');
  }

  extractAccessToken(params) {
    throw Error('abstract method', params);
  }

  async getRawContentUrl(url) {
    throw Error('abstract method', url);
  }

  init() {
    this.accessToken = StorageService.cookieGet(this.getAccessTokenStorageKey());
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
      if (auth === this.getProviderName()) {
        const hashParams = UrlService.getParamsFromHash();
        const { accessToken, expiresIn } = this.extractAccessToken(hashParams) || {};
        if (accessToken) {
          this.accessToken = accessToken;
          const options = {};
          if (expiresIn && expiresIn > 0) {
            options.expires = new Date(new Date().getTime() + expiresIn * 1000);
          }
          StorageService.cookieSet(this.getAccessTokenStorageKey(), accessToken, options);
          this.redirectToPrevUrl();
        }
      }
    }
  }

  redirectToPrevUrl() {
    const redirect = StorageService.sessionGet(STORAGE_KEY_REDIRECT);
    if (redirect) {
      StorageService.sessionRemove(STORAGE_KEY_REDIRECT);
    }
    window.location.href = redirect || UrlService.getAppUrl();
  }

  clearAccessToken() {
    this.accessToken = null;
    StorageService.cookieRemove(this.getAccessTokenStorageKey());
  }

  refreshAuthVerficationToken() {
    this.authVerificationToken = uuidv4();
    StorageService.sessionSet(STORAGE_KEY_AUTH_VERIFICATION, this.authVerificationToken);
  }

  getHttpAuthHeader() {
    return `Bearer ${this.accessToken}`;
  }

}

export {
  AbstractSsoProviderService
};