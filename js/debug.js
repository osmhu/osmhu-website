/* istanbul ignore file */
/* globals window */

const $ = require('jquery');
const log = require('loglevel');

// Show all log levels during development
log.enableAll();

// make global log object available
window.log = log;

// make jQuery accessible in browser
window.$ = $;
