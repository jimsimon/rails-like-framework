const ShardedModel = require('../sharding/sharded-model')
const CategoryGroup = require('./category-group')

module.exports = class Budget extends ShardedModel {
  static get properties () {
    return ['label']
  }
}

Budget.hasMany(CategoryGroup)
