// wdio.conf.js
const path = require('path');
const ClickCapture = require('./test/hooks/capture-clicks');

exports.config = {
  hostname: 'localhost',
  port: 9515, // Default ChromeDriver port
  path: '/', // Default path for ChromeDriver
  
  // Use absolute paths for Windows
  specs: [path.join(__dirname, 'features', '*.feature')],
  exclude: [],
  
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless', '--disable-gpu']
    }
  }],
  
  logLevel: 'info',
  framework: 'cucumber',
  reporters: ['spec'],
  
  cucumberOpts: {
    require: [path.join(__dirname, 'test', 'steps', '*.js')],
    backtrace: true,
    timeout: 60000
  },
  
  services: ['chromedriver'], // Ensure ChromeDriver service is included
  
  before: function () {
    ClickCapture.before();
  },
  
  after: function () {
    ClickCapture.after();
  }
};
