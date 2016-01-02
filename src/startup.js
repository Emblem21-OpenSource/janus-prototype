require('colors');
var pkg = require('../package.json');
var fs = require('fs');
var path = require('path');
var os = require('os');
var noop = function() {};

/**
 *
 */
function loadFiles(dir, suffix) {
  fs.readdirSync(path.join(__dirname, dir)).forEach(function(file) {
    var name = file[0].toUpperCase() + file.substr(1, file.length - 4);
    if(dir !== 'models') {
      name += suffix; 
    }
    if(dir === 'services' && file === 'service') {
      return;
    }

    global[name] = require('./' + dir + '/' + file);
  });
}

// Load axioms
global.Environment = process.env.NODE_ENV;
global.Service = require('./services/service');
global.Config = require('../config/config.json');

loadFiles('models',       'Model');
loadFiles('services',     'Service');
loadFiles('controllers',  'Controller');
loadFiles('policies',     'Policy');
loadFiles('utils',        'Util');

// Activate assocations and routes
require('../config/associations');
require('../config/routes');

module.exports = function(options, next, error) {
  global.Log = options.log;
  Log('--> Starting Janus <--'.bold.cyan);

  DatabaseService.sync({ 
    force: options.rebuild || false
  }).then(function() {
    HttpService.start(parseInt(options.port || Config.api.http.port, 10) || 8880, function() {
      Log('---> Janus '.bold.cyan + pkg.version.yellow + ' ' + (options.environment + ' is running. <---').bold.cyan);
      (next || noop)();
    });
  })['catch'](error || noop);
};