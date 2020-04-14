class UrlService {

  getParamsFromHash() {
    let hash = window.location.hash;
    if (hash) {
      hash = hash.substr(1);
    }
    return new URLSearchParams(hash);
  }

}

const singleton = new UrlService();

export {
  singleton as UrlService
};