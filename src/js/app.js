import React from  'react';
import ReactDOM from  'react-dom';
import { Provider } from 'react-redux';

import { store } from 'src/js/store';

import { AppInitialiser } from 'src/js/bootstrap/app-initialiser';
import { AppEntry } from 'src/js/components/app-entry';

import 'src/styles/app.scss';

// init app
const appInitialiser = new AppInitialiser();
appInitialiser.init();

const mountApp = () => {
  ReactDOM.render(
    (
      <Provider store={store}>
        <AppEntry />
      </Provider>
    ),
    document.getElementById('app')
  );
};

// Mount React App
mountApp();