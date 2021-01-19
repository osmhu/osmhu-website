/* istanbul ignore file */
/* globals window */

import $ from 'jquery';
import log from 'loglevel';

// Show all log levels during development, but don't persist to LocalStorage as setLevel() would do
log.setDefaultLevel('trace');

// make global log object available
window.log = log;

// make jQuery accessible in browser
window.$ = $;

window.__DEV__ = true;
