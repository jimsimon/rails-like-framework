const ShardedModel = require('../../mvc/sharding/sharded-model')

module.exports = class CategoryGroup extends ShardedModel {
  static get properties () {
    return ['label']
  }

  static associate({Budget, Category}) {
    CategoryGroup.belongsTo(Budget)
    CategoryGroup.hasMany(Category)
  }
}

