// `__APP_BASE_URL__` is injected by webpack during build
const getBaseUrl = () => __APP_BASE_URL__;

class UrlService {

  getParamsFromHash() {
    let hash = window.location.hash;
    if (hash) {
      hash = hash.substr(1);
    }
    return new URLSearchParams(hash);
  }

  getParams() {
    return new URLSearchParams(window.location.search);
  }

  getAppUrl(params = null) {
    return this.buildUrl(getBaseUrl(), params);
  }

  buildUrl(base, params = null) {
    let query = '';
    if (params) {
      query = (new URLSearchParams(params)).toString();
    }

    let join = '';
    if (query) {
      join = (base.indexOf('?') < 0) ? '?' : '&';
    }
    return `${base}${join}${query}`;
  }

}

const singleton = new UrlService();

export {
  singleton as UrlService
};