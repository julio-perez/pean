'use strict';

/**
 * Module dependencies.
 */
let config = require('../config'),
  chalk = require('chalk'),
  sequelize = require('./sequelize'),
  express = require('./express'),
  seed = require('./seed');

chalk.enabled = true;

// Initialize Models
module.exports.init = function init(callback) {

  if (config.db.sync.force) {
    console.log(chalk.bold.red('Warning:\tDB_FORCE is true'));  
  }

  sequelize.sequelize.sync({
    force: config.db.sync.force
  })
    .then(function (db) {
      let app = express.init(db);

      // Seed
      if (config.db.sync.force) {
        seed.setup()
          .then(
            function(good) {
              console.log('seed setup was good');
            },
            function(bad) {
              console.log('seed setup was bad');
            }
          );
      }
    
      if (config.seed.init) {
        console.log(chalk.bold.red('Warning:\tDB_SEED is true'));
        seed.start();
      }
    
      if (callback) {
        callback(app, db, config);
      }
      return null;
    });
};

// Start
module.exports.start = function start(callback) {
  let _this = this;

  _this.init(function (app, db, config) {

    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {

      // Logging initialization
      console.log('-----------------------------');
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Environment: ' + process.env.NODE_ENV));
      console.log(chalk.green('Listening on Port: ' + config.port));
      if (config.db.options.database)
        console.log(chalk.green('Database: ' + config.db.options.database));
      if (process.env.NODE_ENV === 'secure' || (config.secure && config.secure.ssl === true)) {
        console.log(chalk.green('HTTPs: on'));
      }
      console.log(chalk.green('App version: ' + config.peanjs.version));
      if (config.peanjs['peanjs-version']) {
        console.log(chalk.green('PEAN.JS version: ' + config.peanjs['peanjs-version']));
        console.log('-----------------------------');
      }
      if (callback) callback(app, db, config);
    });
  });
};
