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
    let query = '';
    if (params) {
      Object.keys(params).forEach(key => {
        if (key !== undefined) {
          query += `${key}=${encodeURIComponent(params[key])}`;
        }
      })
    }
    if (query) {
      query = `/?${query}`;
    }
    return `${getBaseUrl()}${query}`;
  }

}

const singleton = new UrlService();

export {
  singleton as UrlService
};