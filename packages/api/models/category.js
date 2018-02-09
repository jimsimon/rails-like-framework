const ShardedModel = require('../sharding/sharded-model')

module.exports = class Category extends ShardedModel {
  static get properties () {
    return [
      'label',
      'budgeted',
      'activity'
    ]
  }

  static associate({CategoryGroup}) {
    Category.belongsTo(CategoryGroup)
  }
}
