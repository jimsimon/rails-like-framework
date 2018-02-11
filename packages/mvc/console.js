const repl = require("repl")
const globalManager = require('./utils/global-manager-singleton')

// const {createNamespace} = require('cls-hooked')
// const shardingNamespace = createNamespace('sharding')

// shardingNamespace.run(function () {
//   shardingNamespace.set('shard', 'default')
  const replServer = repl.start({
    prompt: 'mvc> '
  })
  Object.assign(replServer.context, globalManager.context)
  // Object.assign(replServer.context, models, {shardingNamespace})
// })

