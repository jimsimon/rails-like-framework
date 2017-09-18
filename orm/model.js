const QueryBuilder = require('./builders/query-builder')
const pool = require('./pool')

module.exports = class Model {

  constructor () {
    if (this.constructor.hasManyAssociations) {
      for (const model of this.constructor.hasManyAssociations) {
        this[`get${model.name}`] = async function () {
          return model.findAll({
            where: {
              [`${this.constructor.name.toLowerCase()}Id`]: this.id
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
    const builder = new QueryBuilder().select(columns).from(this.tableName)
    if (where) {
      builder.where(where)
    }
    const sql = builder.build()
    console.log(sql)
    const whereValues = where ? Object.values(where) : []
    const dbResult = await pool.query(sql, whereValues)
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
    const values = this._getPropertyValues(properties)
    const now = new Date()
    const queryValues = [now, ...values]
    const sql = new QueryBuilder()
      .update(this.tableName)
      .set(['updatedAt', ...properties])
      .values(queryValues)
      .where({'id': this.id})
      .returning(['updatedAt'])
      .build()
    console.log(sql)
    const result = await pool.query(sql, [...queryValues, this.id])
    const row = result.rows[0]
    Object.assign(this, row)
    return this
  }

  async create () {
    const properties = this.constructor.properties
    const values = this._getPropertyValues(properties)
    const now = new Date()
    const queryValues = [now, now, ...values]
    const sql = new QueryBuilder()
      .insert()
      .into(this.tableName)
      .columns(['createdAt', 'updatedAt', ...properties])
      .values(queryValues)
      .returning(['id', 'createdAt', 'updatedAt'])
      .build()
    console.log(sql)
    const result = await pool.query(sql, queryValues)
    const row = result.rows[0]
    Object.assign(this, row)
    return this
  }

  async destroy () {
    const sql = new QueryBuilder()
      .delete()
      .from(this.tableName)
      .where({'id': this.id})
      .build()
    await pool.query(sql, [this.id])
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

  static hasMany (model) {
    if (!this.hasManyAssociations) {
      this.hasManyAssociations = []
    }
    this.hasManyAssociations.push(model)
  }

  _getPropertyValues (properties) {
    const values = []
    for (const property of properties) {
      values.push(this[property])
    }
    return values
  }

  isNew() {
    return this.id === undefined || this.id === null
  }
}
