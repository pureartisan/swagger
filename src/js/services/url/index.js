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
    return `${window.location.protocol}//${window.location.host}${query}`;
  }

}

const singleton = new UrlService();

export {
  singleton as UrlService
};