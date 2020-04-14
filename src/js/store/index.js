import { createStore } from 'redux';
import { rootReducer } from 'src/js/reducers';

const store = createStore(rootReducer);

export {
  store
};
