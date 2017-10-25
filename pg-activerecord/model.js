const BelongsTo = require('./associations/belongs-to')
const HasMany = require('./associations/has-many')
const pool = require('./pool')
const knex = require('knex')({client: 'pg'})

module.exports = class Model {
  constructor () {
    if (this.constructor.associations) {
      for (const association of this.constructor.associations) {
        this[association.getterName] = function () {
          return association.action(this)
        }
      }
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

    const {sql: knexSql, bindings} = builder.toSQL()
    const dbResult = await this._executeQuery(knexSql, bindings)

    const models = []
    for (const row of dbResult.rows) {
      const model = new this()
      for (const column of columns) {
        model[column] = row[column.toLowerCase()]
      }
      models.push(model)
    }
    return models
  }

  static async findOne ({where} = {}) {
    const columns = ['id', 'createdAt', 'updatedAt', ...this.properties]
    const builder = knex.select(columns).from(this.tableName)
    if (where) {
      builder.where(where)
    }

    const {sql: knexSql, bindings} = builder.limit(1).toSQL()
    const dbResult = await this._executeQuery(knexSql, bindings)

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
    let {sql: knexSql, bindings} = knex(this.tableName)
      .update(propertyValueMap)
      .where({'id': this.id})
      .returning(['updatedAt'])
      .toSQL()
    const result = await Model._executeQuery(knexSql, bindings)
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

    let {sql: knexSql, bindings} = knex(this.tableName)
      .insert(propertyValueMap)
      .returning(['id', 'createdAt', 'updatedAt'])
      .toSQL()

    const result = await Model._executeQuery(knexSql, bindings)
    const row = result.rows[0]
    Object.assign(this, row)
    return this
  }

  async destroy () {
    const {sql: knexSql, bindings} = knex(this.tableName)
      .where({'id': this.id})
      .delete()
      .toSQL()

    await Model._executeQuery(knexSql, bindings)
    // TODO: Decide whether to delete createdAt and updatedAt properties
    delete this.id
    return this
  }

  static belongsTo (OtherModel, options) {
    if (!this.associations) {
      this.associations = []
    }
    const association = new BelongsTo(this, OtherModel, options)
    this.associations.push(association)
  }

  static belongsToMany (OtherModel, options) {

  }

  static hasOne (OtherModel) {

  }

  static hasMany (OtherModel, options) {
    if (!this.associations) {
      this.associations = []
    }
    const association = new HasMany(this, OtherModel, options)
    this.associations.push(association)
  }

  isNew () {
    return this.id === undefined || this.id === null
  }

  toJSON () {
    const map = this._getPropertyValueMap(this.constructor.properties)
    return JSON.stringify(map)
  }

  _getPropertyValueMap (properties) {
    const map = {}
    for (const property of properties) {
      map[property] = this[property]
    }
    return map
  }

  static async _executeQuery (knexSql, bindings) {
    const sql = this._fixKnexSql(knexSql)
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

  static _fixKnexSql (sql) {
    let fixedSql = Model._fixPlaceholders(sql)
    fixedSql = Model._removeQuotes(fixedSql)
    return fixedSql
  }

  // Position the bindings for the query. The escape sequence for question mark
  // is \? (e.g. knex.raw("\\?") since javascript requires '\' to be escaped too...)
  static _fixPlaceholders (sql) {
    let questionCount = 0
    return sql.replace(/(\\*)(\?)/g, function (match, escapes) {
      questionCount++
      return `$${questionCount}`
    })
  }

  static _removeQuotes (sql) {
    return sql.replace(/"/g, '')
  }
}
