const HasMany = require('./associations/has-many')
const pool = require('./pool')
const knex = require('knex')({client: 'pg'})

module.exports = class Model {

  constructor () {
    if (this.constructor.associations) {
      for (const {OtherModel, getterName, referenceId} of this.constructor.associations) {
        this[getterName] = function () {
          return OtherModel.findAll({
            where: {
              [referenceId]: this.id
            }
          })
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
    const sql = this._fixKnexSql(knexSql)
    console.log(sql)
    const dbResult = await pool.query(sql, bindings)
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
    const sql = Model._fixKnexSql(knexSql)
    console.log(sql)
    const result = await pool.query(sql, bindings)
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
    const sql = Model._fixKnexSql(knexSql)

    console.log(sql)
    const result = await pool.query(sql, bindings)
    const row = result.rows[0]
    Object.assign(this, row)
    return this
  }

  async destroy () {
    const {sql: knexSql, bindings} = knex(this.tableName)
      .where({'id': this.id})
      .delete()
      .toSQL()
    const sql = Model._fixKnexSql(knexSql)
    await pool.query(sql, bindings)
    // TODO: Decide whether to delete createdAt and updatedAt properties
    delete this.id
    return this
  }

  static belongsTo (model) {

  }

  static belongsToMany (model) {

  }

  static hasOne (model) {

  }

  static hasMany (OtherModel, options) {
    if (!this.associations) {
      this.associations = []
    }
    const association = new HasMany(this, OtherModel, options)
    this.associations.push(association)
  }

  _getPropertyValues (properties) {
    const values = []
    for (const property of properties) {
      values.push(this[property])
    }
    return values
  }

  _getPropertyValueMap (properties) {
    const map = {}
    for (const property of properties) {
      map[property] = this[property]
    }
    return map
  }

  isNew() {
    return this.id === undefined || this.id === null
  }

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
