const ShardedModel = require('pg-activerecord/sharding/sharded-model')

module.exports = class Budget extends ShardedModel {
  static get properties () {
    return ['label']
  }

  static get tableName () {
    return 'budgets'
  }

  static associate ({CategoryGroup}) {
    Budget.hasMany(CategoryGroup)
  }
}

