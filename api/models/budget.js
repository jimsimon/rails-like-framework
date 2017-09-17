const ShardedModel = require('../sharding/sharded-model')
const {DataTypes: {STRING}} = require('sequelize')

module.exports = class Budget extends ShardedModel {
  static get fields () {
    return {
      label: STRING
    }
  }

  static associate ({CategoryGroup}) {
    Budget.hasMany(CategoryGroup)
  }
}
