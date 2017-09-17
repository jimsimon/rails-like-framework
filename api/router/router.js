const BudgetController = require('../controllers/budget-controller')
const {getNamespace} = require('continuation-local-storage')
const shardingNamespace = getNamespace('sharding')
const router = require('express-promise-router')()

router.get('/budgets', BudgetController.getBudgets)

module.exports = router
