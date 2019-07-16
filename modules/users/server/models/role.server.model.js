'use strict';

module.exports = function(sequelize, DataTypes) {

  var userRole = sequelize.define('user_role', {
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

  var Role = sequelize.define('role', {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
      allowNull: true
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  // Class Method
  Role.associate = function (models) {
    Role.belongsToMany(models.user, {
      through: userRole
    });
  };

  return Role;
};
