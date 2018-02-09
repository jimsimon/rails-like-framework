const {Budget, CategoryGroup } = require('../models/index')
const {getNamespace} = require('cls-hooked')

module.exports = class BudgetController {
  static getBudgets (req, res) {
    const shardNamespace = getNamespace('sharding')
    console.log('Shard: ' + shardNamespace.get('shard'))
    res.json([])
  }
}
