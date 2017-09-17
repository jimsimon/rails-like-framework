const repl = require("repl")
const models = require("../models/index")

const {createNamespace} = require('continuation-local-storage')
const shardingNamespace = createNamespace('sharding')

// Patch bluebird to ensure cls context isn't lost
const clsBluebird = require('cls-bluebird')

const Promise = require('bluebird')
clsBluebird(shardingNamespace, Promise)

const sequelizePromise = require('sequelize/lib/promise')
clsBluebird(shardingNamespace, sequelizePromise)

function customEval (cmd, context, filename, callback) {
  shardingNamespace.run(function () {
    shardingNamespace.set('shard', 'default')
    callback(null, eval(cmd))
  })
}

const replServer = repl.start({
  eval: customEval
})

Object.assign(replServer.context, models, {shardingNamespace})
