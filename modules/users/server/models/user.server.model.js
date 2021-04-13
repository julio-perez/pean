'use strict';

let crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');

/**
 * Hash password
 * @param  {[type]} user     [description]
 * @param  {[type]} password [description]
 * @return {[type]}          [description]
 */
let hashPassword = function(user, password) {
  if (!password) {
    password = user.dataValues.password;
  }

  if (user.dataValues.salt && user.dataValues.password) {
    const key = crypto.pbkdf2Sync(password, user.dataValues.salt, 10000, 64, 'sha512'); //.toString('base64');
    return key.toString('base64');
  } else {
    return password;
  }
};

/**
 * Check image
 * @param  {[type]} user [description]
 * @return {[type]}      [description]
 */
let checkImage = function(user) {
  let profileImageURLDefault = 'modules/users/client/img/profile/default.png';

  if (!user.dataValues.profileImageURL) {
    user.dataValues.profileImageURL = profileImageURLDefault;
  }
};

/**
 * Check password
 * @param  {[type]} user [description]
 * @return {[type]}      [description]
 */
let checkPassword = function(user) {
  let passwordTest = owasp.test(user.password);

  if (passwordTest.errors.length) {
    let error = passwordTest.errors.join(' ');
    throw new Error(error);
  } else {
    user.dataValues.salt = crypto.randomBytes(16).toString('base64');
    user.dataValues.password = hashPassword(user);
  }
};

/**
 * Exports
 * @param  {[type]} sequelize [description]
 * @param  {[type]} DataTypes [description]
 * @return {[type]}           [description]
 */
module.exports = function(sequelize, DataTypes) {
  
  let userRole;
  userRole = sequelize.define('user_role', {
    userUserId: {
      type: DataTypes.INTEGER,
      field: 'user_user_id',
      references: {
        model: 'user',
        key: 'user_id'
      }
    },
    roleRoleId: {
      type: DataTypes.INTEGER,
      field: 'role_role_id',
      references: {
        model: 'role',
        key: 'role_id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    userUserId: 'user_user_id',
    roleRoleId: 'role_role_id'
  });

  let User = sequelize.define('user', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    displayName: DataTypes.STRING,
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      allowNull: function () {
        let isLocal = this.provider === 'local';
        return isLocal;
      },
      type: DataTypes.STRING
    },
    salt: DataTypes.STRING,
    profileImageURL: {
      type: DataTypes.STRING
    },
    provider: {
      type: DataTypes.STRING
    },
    providerData: {
      type: DataTypes.JSONB
    },
    additionalProvidersData: {
      type: DataTypes.JSONB
    },
    resetPasswordToken: {
      type: DataTypes.STRING
    },
    resetPasswordExpires: {
      type: DataTypes.DATE
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  /**
   * Before create
   * @param  {[type]} user     [description]
   * @param  {[type]} options) { checkImage(user); checkPassword(user); } [description]
   * @return {[type]}          [description]
   */
  User.beforeCreate(function(user, options) {
    if (!user.dataValues.profileImageURL) {
      checkImage(user);
    }

    if (user.dataValues.password && user._changed.password) {
      checkPassword(user);
    }
  });

  /**
   * Before update
   * @param  {[type]} user     [description]
   * @param  {[type]} options) { checkImage(user); checkPassword(user); } [description]
   * @return {[type]}          [description]
   */
  User.beforeUpdate(function(user, options) {
    if (!user.dataValues.profileImageURL) {
      checkImage(user);
    }

    if (user.dataValues.password && user._changed.password) {
      checkPassword(user);
    }
  });

  /**
  * Associate
  * @param  {[type]} models [description]
  * @return {[type]}        [description]
  */
  User.associate = function(models) {
    User.belongsToMany(models.role, {
      through: userRole
    });
  };
  /**
  * Find unique username
  * @param  {[type]}   username [description]
  * @param  {[type]}   suffix   [description]
  * @param  {Function} callback [description]
  * @return {[type]}            [description]
  */
  User.findUniqueUsername = function(username, suffix, callback) {

    let _this = this;
    let possibleUsername = username.toLowerCase() + (suffix || '');

    _this
      .findOne({
        where: {
          username: possibleUsername
        }
      })
      .then(function(user) {
        if (!user) {
          callback(possibleUsername);
        } else {
          return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
        }

        return null;
      })
      .catch(function(err) {
        console.log(err);
        callback(null);
      });
  };
  /**
  * Generate random passphrase
  * @return {[type]} [description]
  */
  User.generateRandomPassphrase = function() {
    return new Promise(function(resolve, reject) {
      let password = '';
      let repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

      // iterate until the we have a valid passphrase.
      // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
      while (password.length < 20 || repeatingCharacters.test(password)) {
        // build the random password
        password = generatePassword.generate({
          length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
          numbers: true,
          symbols: false,
          uppercase: true,
          excludeSimilarCharacters: true,
        });

        // check if we need to remove any repeating characters.
        password = password.replace(repeatingCharacters, '');
      }

      // Send the rejection back if the passphrase fails to pass the strength test
      if (owasp.test(password).errors.length) {
        reject(new Error('An unexpected problem occured while generating the random passphrase'));
      } else {
        // resolve with the validated passphrase
        resolve(password);
      }
    });
  };

  /**
  * Authenticate
  * @param  {[type]} user     [description]
  * @param  {[type]} password [description]
  * @return {[type]}          [description]
  */
  User.prototype.authenticate = function(user, password) {
    return user.dataValues.password === hashPassword(user, password);
  };

  return User;
};
