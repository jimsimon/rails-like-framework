const {getNamespace} = require('cls-hooked')

module.exports = class BudgetController {
  index (req, res) {
    const shardNamespace = getNamespace('sharding')
    console.log('Shard: ' + shardNamespace.get('shard'))
    res.json([])
  }
}
