const repl = require("repl")
const models = require("../models/index")

const {createNamespace} = require('cls-hooked')
const shardingNamespace = createNamespace('sharding')

shardingNamespace.run(function () {
  shardingNamespace.set('shard', 'default')
  const replServer = repl.start({
    prompt: 'rails> '
  })
  Object.assign(replServer.context, models, {shardingNamespace})
})

