'use strict';

/**
 * Article Schema
 */
module.exports = function(sequelize, DataTypes) {

  let Article = sequelize.define('article', {
    article_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: null
    },
    content: DataTypes.TEXT,
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

  Article.associate = function(models) {
    Article.belongsTo(models.user, {
      foreignKey: 'user_id',
      foreignKeyConstraint: true
    });
  };

  return Article;
};
