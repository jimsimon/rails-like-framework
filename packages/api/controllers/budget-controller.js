const {Budget, CategoryGroup } = require('../models/index')
const {getNamespace} = require('cls-hooked')

module.exports = class BudgetController {
  index (req, res) {
    console.log('index')
    res.status(200).send()
  }

  static getBudgets (req, res) {
    const shardNamespace = getNamespace('sharding')
    console.log('Shard: ' + shardNamespace.get('shard'))
    res.json([])
  }
}
