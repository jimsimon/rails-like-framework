const ShardedModel = require('pg-activerecord/sharding/sharded-model')

module.exports = class CategoryGroup extends ShardedModel {
  static get properties () {
    return ['label']
  }

  static associate({Budget, Category}) {
    CategoryGroup.belongsTo(Budget)
    CategoryGroup.hasMany(Category)
  }
}

