/* global sessionStorage fetch */

import getPlatform from './get-platform';
import winXhr from './win-xhr';

const getGoogleTkk = (chinaMode) => {
  if (sessionStorage.getItem('googleTkk') == null) {
    const endpoint = process.env.REACT_APP_GOOGLE_ENDPOINT || (chinaMode ? 'https://translate.google.cn' : 'https://translate.google.com');

    const uri = `${endpoint}/m/translate`;

    return Promise.resolve()
      .then(() => {
        switch (getPlatform()) {
          case 'windows': {
            return winXhr({
              type: 'get',
              uri,
              responseType: 'text',
            });
          }
          default: {
            return fetch(uri)
              .then(response => response.text());
          }
        }
      })
      .then((body) => {
        const startStr = 'campaign_tracker_id:\'1h\',tkk:';
        const endStr = ',experiment_ids:';
        const startI = body.indexOf(startStr) + startStr.length;
        const endI = body.indexOf(endStr);
        const tkkEval = body.substring(startI, endI);

        /* eslint-disable */
        const x = eval(eval(tkkEval));
        /* eslint-enable */
        sessionStorage.setItem('googleTkk', x);
        return sessionStorage.getItem('googleTkk');
      });
  }
  return Promise.resolve(sessionStorage.getItem('googleTkk'));
};

/* eslint-disable */
const generateB = (a, b) => {
  let x = a;
  for (let d = 0; d < b.length - 2; d += 3) {
    let c = b.charAt(d + 2);
    c = c >= 'a' ? c.charCodeAt(0) - 87 : Number(c);
    c = b.charAt(d + 1) === '+' ? x >>> c : x << c;
    x = b.charAt(d) === '+' ? x + c & 4294967295 : x ^ c;
  }
  return x;
};
/* eslint-enable */

const generateGoogleTranslateToken = (a, chinaMode) =>
  getGoogleTkk(chinaMode)
    .then((tkk) => {
      /* eslint-disable */
      for (var e = tkk.split("."), h = Number(e[0]) || 0, g = [], d = 0, f = 0; f < a.length; f++) {
          var c = a.charCodeAt(f);
          128 > c ? g[d++] = c : (2048 > c ? g[d++] = c >> 6 | 192 : (55296 == (c & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(f + 1) & 64512) ? (c = 65536 + ((c & 1023) << 10) + (a.charCodeAt(++f) & 1023), g[d++] = c >> 18 | 240, g[d++] = c >> 12 & 63 | 128) : g[d++] = c >> 12 | 224, g[d++] = c >> 6 & 63 | 128), g[d++] = c & 63 | 128)
      }
      a = h;
      for (d = 0; d < g.length; d++) a += g[d], a = generateB(a, "+-a^+6");
      a = generateB(a, "+-3^+b+-f");
      a ^= Number(e[1]) || 0;
      0 > a && (a = (a & 2147483647) + 2147483648);
      a %= 1E6;
      return a.toString() + "." + (a ^ h);
      /* eslint-enable */
    });

export default generateGoogleTranslateToken;
