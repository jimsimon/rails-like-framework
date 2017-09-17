const ShardedModel = require('../sharding/sharded-model')
const {DataTypes: {INTEGER, STRING}} = require('sequelize')

module.exports = class Category extends ShardedModel {
  static get fields () {
    return {
      label: STRING,
      budgeted: INTEGER,
      activity: INTEGER
    }
  }

  static associate({CategoryGroup}) {
    Category.belongsTo(CategoryGroup)
  }
}
