import { BitbucketService } from 'src/js/services/bitbucket';

class AppInitialiser {

  init() {
    BitbucketService.init();
  }

}


const singleton = new AppInitialiser();

export {
  singleton as AppInitialiser
};
