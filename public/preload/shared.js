/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  remote,
  ipcRenderer,
  webFrame,
  desktopCapturer,
} = require('electron');
const isDev = require('electron-is-dev');
const machineId = require('node-machine-id');

// Activate the Sentry Electron SDK as early as possible in every process.
if (!isDev && ipcRenderer.sendSync('get-preference', 'sentry')) {
  // eslint-disable-next-line global-require
  require('../libs/sentry');
}

webFrame.setVisualZoomLevelLimits(1, 1);

window.remote = remote;
window.ipcRenderer = ipcRenderer;
window.desktopCapturer = desktopCapturer;

window.machineId = machineId.machineIdSync();
window.optOutTelemetry = !ipcRenderer.sendSync('get-preference', 'telemetry');
window.macPermissions = process.platform === 'darwin' ? require('node-mac-permissions') : null;
