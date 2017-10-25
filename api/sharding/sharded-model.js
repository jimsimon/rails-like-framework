const {Model} = require('pg-activerecord')
const {getNamespace} = require('cls-hooked')

module.exports = class ShardedModel extends Model {

  static async beforeExecuteQuery (client) {
    await super.beforeExecuteQuery(client)
    const shardName = this._getShardName()
    await client.query('SET search_path TO $1', [shardName])
  }

  static _getShardName() {
    const shardNamespace = getNamespace('sharding')
    console.log('Shard: ' + shardNamespace.get('shard'))
    return shardNamespace.get('shard')
  }
}
