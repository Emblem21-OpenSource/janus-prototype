var Sequelize = require('sequelize');
var fs = require('fs');
var settings = Config.api.database[Config.api.database.environments[Environment] || 'development'];

if(settings.dialect === 'sqlite') {
  fs.closeSync(fs.openSync(settings.storage, 'w'));
}

var db = new Sequelize(settings.name, settings.username, settings.password, {
  host: settings.host,
  dialect: settings.dialect,
  pool: settings.pool,
  storage: settings.storage,
  logging: settings.logging === false ? false : Log
});

module.exports = db;