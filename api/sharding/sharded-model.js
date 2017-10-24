const {Model} = require('sequelize')
const {getNamespace} = require('cls-hooked')

module.exports = class ShardedModel extends Model {
  static bulkCreate (records, options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.bulkCreate(records, shardedOptions)
  }

  static count (options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.count(shardedOptions)
  }

  static create (values, options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.create(values, shardedOptions)
  }

  static findAll (options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    console.log(JSON.stringify(shardedOptions))
    return super.findAll(shardedOptions)
  }

  static findById (id, options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.findById(id, shardedOptions)
  }

  static findOne (options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.findOne(shardedOptions)
  }

  static increment (fields, options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.increment(fields, shardedOptions)
  }

  static truncate (options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.truncate(shardedOptions)
  }

  static upsert (values, options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.upsert(values, shardedOptions)
  }

  decrement (fields, options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.decrement(fields, shardedOptions)
  }

  destroy (options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.destroy(shardedOptions)
  }

  restore (options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.restore(shardedOptions)
  }

  increment (fields, options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.increment(fields, shardedOptions)
  }

  save (options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.save(shardedOptions)
  }

  update (values, options) {
    const shardedOptions = ShardedModel._applySearchPath(options)
    return super.update(shardedOptions)
  }

  static _applySearchPath (options) {
    if (options) {
      const shardName = ShardedModel._getShardName()
      if (shardName) {
        return Object.assign(
          {
            searchPath: shardName
          },
          options
        )
      }
    }
    return options
  }

  static _getShardName() {
    const shardNamespace = getNamespace('sharding')
    console.log('Shard: ' + shardNamespace.get('shard'))
    return shardNamespace.get('shard')
  }
}
