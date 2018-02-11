const { createNamespace } = require('cls-hooked')
const shardingNamespace = createNamespace('sharding')

module.exports = function (req, res, next) {
  shardingNamespace.run(function () {
    shardingNamespace.bindEmitter(res)
    shardingNamespace.bindEmitter(req)
    shardingNamespace.set('shard', 'public')
    next()
  })
}
