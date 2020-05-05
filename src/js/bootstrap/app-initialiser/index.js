import { BitbucketService } from 'src/js/services/bitbucket';
import { GitlabService } from 'src/js/services/gitlab';

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
