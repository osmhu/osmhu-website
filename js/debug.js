/* istanbul ignore file */
/* globals window */

import $ from 'jquery';
import log from 'loglevel';

// Show all log levels during development
log.enableAll();

// make global log object available
window.log = log;

// make jQuery accessible in browser
window.$ = $;
