const ShardedModel = require('../sharding/sharded-model')
const {DataTypes: {STRING}} = require('sequelize')

module.exports = class CategoryGroup extends ShardedModel {
  static get fields () {
    return {
      label: STRING
    }
  }

  static associate ({Budget, Category}) {
    CategoryGroup.belongsTo(Budget)
    CategoryGroup.hasMany(Category)
  }
}
