const {Budget, CategoryGroup } = require('../models/index')
const {getNamespace} = require('continuation-local-storage')

module.exports = class BudgetController {
  static getBudgets (req, res) {
    const shardNamespace = getNamespace('sharding')
    console.log('Shard: ' + shardNamespace.get('shard'))
    Budget.findAll({include: CategoryGroup}).then(function (budgets) {
      res.json(budgets)
    })
  }
}
