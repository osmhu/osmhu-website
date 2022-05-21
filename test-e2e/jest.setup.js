jest.setTimeout(30 * 1000);

const now = (Date.now()/1e3)|0;
global.testStart = now;

const reportDirectory = __dirname + `/report-${testStart}/`;
global.reportDirectory = reportDirectory;
