const BelongsTo = require('./associations/belongs-to')
const HasMany = require('./associations/has-many')
const Collection = require('./collection')
const pool = require('./pool')
const knex = require('knex')({client: 'pg'})

class Model {
  constructor () {
    const getterCache = {}
    for (const associationDefinition of this.constructor.associationDefinitions) {
      Object.defineProperty(this, associationDefinition.propertyName, {
        get: function () {
          let value = getterCache[associationDefinition.propertyName]
          if (!value) {
            value = associationDefinition.action(this)
            getterCache[associationDefinition.propertyName] = value
          }
          return value
        }
      })
    }
  }

  static get properties () {
    throw new Error(`No properties have been defined for ${this.tableName}`)
  }

  static get tableName () {
    return this.name
  }

  get tableName () {
    return this.constructor.tableName
  }

  static async findAll ({where} = {}) {
    const columns = ['id', 'createdAt', 'updatedAt', ...this.properties]
    const builder = knex.select(columns).from(this.tableName)
    if (where) {
      builder.where(where)
    }

    const {sql, bindings} = builder.toSQL().toNative()
    const dbResult = await this._executeQuery(sql, bindings)

    const collection = new Collection()
    for (const row of dbResult.rows) {
      const model = new this()
      for (const column of columns) {
        model[column] = row[column.toLowerCase()]
      }
      collection.push(model)
    }
    return collection
  }

  static async findOne ({where} = {}) {
    const columns = ['id', 'createdAt', 'updatedAt', ...this.properties]
    const builder = knex.select(columns).from(this.tableName)
    if (where) {
      builder.where(where)
    }

    const {sql, bindings} = builder.limit(1).toSQL().toNative()
    const dbResult = await this._executeQuery(sql, bindings)

    const row = dbResult.rows[0]
    const model = new this()
    for (const column of columns) {
      model[column] = row[column.toLowerCase()]
    }
    return model
  }

  async save () {
    if (this.isNew()) {
      return this.create()
    } else {
      return this.update()
    }
  }

  async update () {
    const properties = this.constructor.properties
    const propertyValueMap = this._getPropertyValueMap(properties)
    propertyValueMap.updatedAt = new Date()
    let {sql, bindings} = knex(this.tableName)
      .update(propertyValueMap)
      .where({'id': this.id})
      .returning(['updatedAt'])
      .toSQL()
      .toNative()
    const result = await Model._executeQuery(sql, bindings)
    const row = result.rows[0]
    Object.assign(this, row)
    return this
  }

  async create () {
    const properties = this.constructor.properties
    const propertyValueMap = this._getPropertyValueMap(properties)
    const now = new Date()
    propertyValueMap.updatedAt = now
    propertyValueMap.createdAt = now

    let {sql, bindings} = knex(this.tableName)
      .insert(propertyValueMap)
      .returning(['id', 'createdAt', 'updatedAt'])
      .toSQL()
      .toNative()

    const result = await Model._executeQuery(sql, bindings)
    const row = result.rows[0]
    Object.assign(this, row)
    return this
  }

  async destroy () {
    const {sql, bindings} = knex(this.tableName)
      .where({'id': this.id})
      .delete()
      .toSQL()
      .toNative()

    await Model._executeQuery(sql, bindings)
    // TODO: Decide whether to delete createdAt and updatedAt properties
    delete this.id
    return this
  }

  static belongsTo (OtherModel, options) {
    const associationDefinition = new BelongsTo(this, OtherModel, options)
    this.associationDefinitions.push(associationDefinition)
  }

  static belongsToMany (OtherModel, options) {

  }

  static hasOne (OtherModel) {

  }

  static hasMany (OtherModel, options) {
    const associationDefinition = new HasMany(this, OtherModel, options)
    this.associationDefinitions.push(associationDefinition)
  }

  isNew () {
    return this.id === undefined || this.id === null
  }

  // toJSON () {
  //   const map = this._getPropertyValueMap(this.constructor.properties)
  //   return JSON.stringify(map)
  // }

  _getPropertyValueMap (properties) {
    const map = {}
    for (const property of properties) {
      map[property] = this[property]
    }
    return map
  }

  static async _executeQuery (sql, bindings) {
    console.log(sql)
    const client = await pool.connect()
    try {
      await this.beforeExecuteQuery(client)
      return await client.query(sql, bindings)
    } finally {
      client.release()
    }
  }

  static async beforeExecuteQuery () {}
}

Model.associationDefinitions = []

module.exports = Model
