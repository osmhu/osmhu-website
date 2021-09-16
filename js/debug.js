/* istanbul ignore file */

import $ from 'jquery';
import log from 'loglevel';

// Show all log levels during development, but don't persist to LocalStorage as setLevel() would do
log.setDefaultLevel('trace');

// make global log object available
window.log = log;

// make jQuery accessible in browser
window.$ = $;

// eslint-disable-next-line no-underscore-dangle
window.__DEV__ = true;

// eslint-disable-next-line no-underscore-dangle
window.__DEV_SHARE_URL__ = 'https://osmhu.lan';
