const { createNamespace } = require('cls-hooked')
const shardingNamespace = createNamespace('sharding')

// Patch bluebird to ensure cls context isn't lost
const clsBluebird = require('cls-bluebird')

const Promise = require('bluebird')
clsBluebird(shardingNamespace, Promise)

const sequelizePromise = require('sequelize/lib/promise')
clsBluebird(shardingNamespace, sequelizePromise)

module.exports = function (req, res, next) {
  shardingNamespace.run(function () {
    shardingNamespace.bindEmitter(res)
    shardingNamespace.bindEmitter(req)
    shardingNamespace.set('shard', 'public')
    next()
  })
}
