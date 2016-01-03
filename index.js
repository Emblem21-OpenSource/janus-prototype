var program = require('commander');
var pkg = require('./package.json');
var fs = require('fs');

program.
  version(pkg.version).
  option('--dev', 'Run development server').
  option('--rebuild', 'Rebuild the database').
  option('--log [type]', 'Logging output.  Default is console (none, console, file path)').
  option('--port [number]', 'Port to run the server on.  Default is 8880').
  parse(process.argv);

if(program.dev) {
  program.environment = 'development';
} else {
  program.environment = 'production';
}

if(program.log === undefined) {
  program.log = 'console';
}

if(program.log === 'console') {
  program.log = console.log;
} else {
  program.log = function() {};
}

require('./src/startup')(program, function() {}, function(err) { 
  console.error(err);
});