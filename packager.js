/* eslint-disable no-console */

const builder = require('electron-builder');
const glob = require('glob');
const del = require('del');

const electronVersion = require('./package.json').devDependencies.electron;
const displayLanguages = require('./src/constants/display-languages').default;

const { Platform } = builder;

if (process.platform !== 'darwin') {
  console.log(`${process.platform} is not supported.`);
  process.exit(0);
}

console.log(`Packaging for ${process.platform}`);

const productName = 'Translatium';

// Promise is returned
builder.build({
  targets: Platform.MAC.createTarget(['zip', 'mas']),
  config: {
    electronVersion,
    appId: 'com.moderntranslator.app',
    productName,
    files: [
      '!docs/**/*',
      '!popclip/**/*',
    ],
    directories: {
      buildResources: 'build-resources',
    },
    protocols: {
      name: 'Translatium',
      schemes: ['translatium'],
    },
    afterPack: ({ appOutDir }) =>
      new Promise((resolve, reject) => {
        console.log('afterPack', appOutDir, process.platform);

        const languages = Object.keys(displayLanguages);

        if (process.platform === 'darwin') {
          glob(`${appOutDir}/${productName}.app/Contents/Resources/!(${languages.join('|')}).lproj`, (err, files) => {
            console.log(files);
            if (err) return reject(err);
            return del(files).then(resolve, reject);
          });
        } else {
          resolve();
        }
      }),
  },
})
  .then(() => {
    console.log('build successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
