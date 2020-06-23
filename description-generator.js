const fs = require('fs-extra');
const path = require('path');

const displayLanguages = require('./public/libs/locales/languages');

const localesDir = path.resolve(__dirname, 'public', 'libs', 'locales');
Object.keys(displayLanguages).forEach((langCode) => {
  // eslint-disable-next-line no-console
  console.log(`Generating description for ${langCode}...`);
  const rawDesc = fs.readFileSync(path.join(localesDir, langCode, 'description.txt'), 'utf8');

  const supportedLanguageStrings = fs.readJsonSync(path.join(localesDir, langCode, 'languages.json'));
  const supportedLanguages = Object.keys(supportedLanguageStrings)
    .map((code) => supportedLanguageStrings[code])
    .sort((x, y) => x.localeCompare(y));

  ['macOS', 'Windows', 'Linux'].forEach((operatingSystem) => {
    const desc = rawDesc
      .replace(/{appName}/g, 'Translatium')
      .replace(/{operatingSystem}/g, operatingSystem)
      .replace(/{appUrl}/g, 'https://translatiumapp.com')
      .replace(/{supportedLanguages}/g, supportedLanguages.join(', '));
    const distDescFilePath = path.join(__dirname, 'dist', 'description', langCode, `${operatingSystem}.txt`);
    fs.outputFileSync(distDescFilePath, desc, 'utf8');
  });
});
