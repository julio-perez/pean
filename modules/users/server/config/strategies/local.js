'use strict';

/**
 * Module dependencies.
 */
let path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
  // Use local strategy
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    db.user.findOne({
      where: {
        username: username
      }
    }).then(function(user) {
      if (!user || !user.authenticate(user, password)) {
        done(null, false, {
          message: 'Invalid username or password'
        });

        return null;
      }

      done(null, user);

      return null;
    }).catch(function(err) {
      done(err);
    });
  }));
};
