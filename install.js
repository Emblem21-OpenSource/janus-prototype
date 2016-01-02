#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

var fs = require('fs');
var RandomUtils = require('./src/utils/random');

/**
 *
 */
function populateFile(path, args) {
  var file = fs.readFileSync(path).toString();
  for(var i in args) {
    file = file.replace(new RegExp('\\$\\$' + i, 'g'), args[i]);
  }
  fs.writeFileSync(path, file);
}

var files = [
  'README.md',
  'COPYWRITE.md',
  'package.json',
  'config/config.json',
  'config/nginx.conf',
  'config/pm2-deploy.json',
  'config/pm2-dev.json',
  'config/pm2-prod.json'
];

var arguments = process.argv.slice(2);

var args = {
  projectName: arguments[0],
  authorName: arguments[1],
  projectDesc: arguments[2],
  projectHost: arguments[3],
  dbHost: arguments[4],
  dbUser: arguments[5],
  dbPass: arguments[6],
  cwd: process.cwd()
};

RandomUtils.getRandom(128, function(jwtSecret) {
  args.jwtSecret = jwtSecret;
  for(var i in files) {
    populateFile(files[i], args);
  }
});