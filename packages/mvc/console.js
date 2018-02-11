const repl = require("repl")

// const {createNamespace} = require('cls-hooked')
// const shardingNamespace = createNamespace('sharding')

// shardingNamespace.run(function () {
//   shardingNamespace.set('shard', 'default')
  const replServer = repl.start({
    prompt: 'mvc> '
  })
  // Object.assign(replServer.context, models, {shardingNamespace})
// })

