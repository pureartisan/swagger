import Cookies from 'js-cookie';

class StorageService {

  get(key, defaultValue = null) {
    try {
      const json = localStorage.getItem(key);
      return JSON.parse(json);
    } catch {
      return defaultValue;
    }
  }

  set(key, value) {
    const json = JSON.stringify(value);
    localStorage.setItem(key, json);
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  sessionGet(key, defaultValue = null) {
    try {
      const json = sessionStorage.getItem(key);
      return JSON.parse(json);
    } catch {
      return defaultValue;
    }
  }

  sessionSet(key, value) {
    const json = JSON.stringify(value);
    sessionStorage.setItem(key, json);
  }

  sessionRemove(key) {
    sessionStorage.removeItem(key);
  }

  sessionClear() {
    sessionStorage.clear();
  }

  cookieGet(key, defaultValue = null) {
    try {
      const json = Cookies.get(key);
      return JSON.parse(json);
    } catch {
      return defaultValue;
    }
  }

  cookieSet(key, value, options = {}) {
    const json = JSON.stringify(value);
    Cookies.set(key, json, options);
  }

  cookieRemove(key, options = {}) {
    Cookies.remove(key, options);
  }

}

const singleton = new StorageService();

export {
  singleton as StorageService
};