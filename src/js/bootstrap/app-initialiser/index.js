import { BitbucketService, GitlabService } from 'src/js/services/sso-providers';

class AppInitialiser {

  init() {
    BitbucketService.init();
    GitlabService.init();
  }

}


const singleton = new AppInitialiser();

export {
  singleton as AppInitialiser
};
