class DeviceService {

  constructor() {
    this._isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
    this._isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    this._isIOS = /(iPhone|iPod|iPad)/i.test(navigator.platform);
  }

  isMac() {
    return this._isMac;
  }

  isMacLike() {
    return this._isMacLike;
  }

  isIOS() {
    return this._isIOS;
  }

}

const singleton = new DeviceService();

export {
  singleton as DeviceService
};