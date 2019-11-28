/* global document */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import 'typeface-roboto/index.css';

import './main.css';

import store from './state/reducers';
import { updateLocale } from './state/root/locale/actions';

import AppWrapper from './components/app-wrapper';

const { webFrame } = window.require('electron');

webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

store.dispatch(updateLocale(store.getState().preferences.langId));

render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>,
  document.getElementById('app'),
);

window.speechSynthesis.onvoiceschanged = () => {
  render(
    <Provider store={store}>
      <AppWrapper />
    </Provider>,
    document.getElementById('app'),
  );
};
