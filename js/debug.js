/* istanbul ignore file */
/* globals window */

const log = require('loglevel');

// Show all log levels during development
log.enableAll();

// make global log object available
window.log = log;
