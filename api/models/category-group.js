const ShardedModel = require('../sharding/sharded-model')
const Budget = require('./budget')
const Category = require('./category')

module.exports = class CategoryGroup extends ShardedModel {
  static get properties () {
    return ['label']
  }
}

CategoryGroup.belongsTo(Budget)
CategoryGroup.hasMany(Category)
