import { combineReducers } from 'redux';

import { sso } from './sso';

const rootReducer = combineReducers({
  sso
});

export {
  rootReducer
};
