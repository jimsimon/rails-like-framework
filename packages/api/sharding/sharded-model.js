const escape = require('pg-escape')
const Model = require('pg-activerecord/model')
const {getNamespace} = require('cls-hooked')

module.exports = class ShardedModel extends Model {

  static async beforeExecuteQuery (client) {
    await super.beforeExecuteQuery(client)
    const shardName = this._getShardName()
    await client.query(escape('SET search_path TO %s', [shardName]))
  }

  static _getShardName() {
    const shardNamespace = getNamespace('sharding')
    return shardNamespace.get('shard')
  }
}
