'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  _ = require('lodash'),
  chalk = require('chalk'),
  db = require(path.resolve('./config/lib/sequelize')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

chalk.enabled = true;

var Op = db.Sequelize.Op;
/**
 * Read
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.read = function (req, res) {
  // console.log('* user.server.controller - read *');

  var userId = req.params.userId;
  
  db.user
    .findOne({
      where: {
        user_id: userId
      },
      include: [{
        all: true
      }]
    })
    .then(function(user) {
      user.dataValues.password = null;
      user.dataValues.salt = null;
      user._previousDataValues.password = null;
      user._previousDataValues.salt = null;
      return res.json(user);
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Delete
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.delete = function(req, res) {
  // console.log('* user.server.controller - delete *');

  var userId = req.params.userId;

  db.user
    .findOne({
      where: {
        user_id: userId
      },
      include: [{
        all: true
      }],
    })
    .then(function(user) {
      user
        .destroy()
        .then(function() {
          return res.json(user);
        })
        .catch(function(err) {
          console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        });

      return null;
    })
    .catch(function(err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * List
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.list = function(req, res) {
  // console.log('* user.server.controller - list *');

  var limit = req.query.limit;
  var offset = req.query.offset;
  var search = (req.query.search === undefined) ? '%' : req.query.search;

  var query = '%' + search + '%';

  db.user
    .findAndCountAll({
      where: {
        [Op.or]: [{
          firstName: {
            [Op.like]: query
          }
        }, {
          lastName: {
            [Op.like]: query
          }
        }, {
          displayName: {
            [Op.like]: query
          }
        }, {
          username: {
            [Op.like]: query
          }
        }, {
          email: {
            [Op.like]: query
          }
        }]
      },
      distinct: true,
      include: [{
        all: true
      }],
      limit: limit,
      offset: offset,
      order: [
        ['createdAt', 'DESC']
      ]
    })
    .then(function(users) {
      return res.json(users);
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Modify
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.modify = function(req, res) {
  // console.log('* user.server.controller - modify *');

  var userId = req.params.userId;
  var roles = req.query.roles;

  if (!roles) {
    roles = [];
  }

  db.user
    .findOne({
      where: {
        user_id: userId
      },
      include: [{
        all: true
      }],
    })
    .then(function(user) {

      user
        .setRoles(roles)
        .then(function(roles) {

          db.user
            .findOne({
              where: {
                user_id: userId
              },
              include: [{
                all: true
              }],
            })
            .then(function(user) {
              return res.json(user);
            })
            .catch(function(err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            });

          return null;
        })
        .catch(function(err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        });

      return null;
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Roles
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.roles = function (req, res) {
  // console.log('* user.server.controller - roles *');
  
  db.role
    .findAll()
    .then(function(roles) {
      return res.json(roles);
    })
    .catch(function(err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};
