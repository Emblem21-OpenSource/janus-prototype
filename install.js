#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

var fs = require('fs');
var RandomUtils = require('./src/utils/random');

/**
 *
 */
function populateFile(path, args) {
  var file = fs.readFileSync(path);
  for(var i in args) {
    file.replace(i, args[i]);
  }
  fs.writeFileSync(path, file);
}

var files = [
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
  projectHost: arguments[2],
  dbHost: arguments[3],
  dbUser: arguments[4],
  dbPass: arguments[5],
  cwd: process.cwd()
};

RandomUtils.getRandom(64, function(jwtSecret) {
  args.jwtSecret = jwtSecret;
  for(var i in files) {
    populateFile(files[i], args);
  }
});