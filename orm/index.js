const {Pool} = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'orm',
  password: null
})

const createValuePlaceholders = function (start, count) {
  const valuePlaceholders = []
  for (let i = start; i<start + count; i++) {
    valuePlaceholders.push('$'+i)
  }
  return valuePlaceholders
}

class SelectQueryBuilder {
  constructor () {
    this.descriptor = {}
  }

  columns (columns) {
    this.descriptor.columns = columns
    return this
  }

  from (table) {
    this.descriptor.table = table
    return this
  }

  build () {
    const { columns, table } = this.descriptor
    return `SELECT ${columns.join(', ')} FROM ${table};`
  }
}

class InsertQueryBuilder {
  constructor () {
    this.descriptor = {}
  }

  into (table) {
    this.descriptor.table = table
    return this
  }

  columns (columns) {
    this.descriptor.columns = columns
    return this
  }

  values (values) {
    this.descriptor.values = values
    return this
  }

  returning (columns) {
    this.descriptor.returning = columns
    return this
  }

  build () {
    const {table, columns, values, returning} = this.descriptor
    const valuePlaceholders = createValuePlaceholders(1, values.length)
    return `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${valuePlaceholders.join(', ')}) RETURNING ${returning.join(', ')};`
  }
}

class UpdateQueryBuilder {
  constructor () {
    this.descriptor = {}
  }

  table (table) {
    this.descriptor.table = table
    return this
  }

  set (columns) {
    this.descriptor.columns = columns
    return this
  }

  values (values) {
    this.descriptor.values = values
    return this
  }

  where (where) {
    this.descriptor.where = where
    return this
  }

  returning (columns) {
    this.descriptor.returning = columns
    return this
  }

  build () {
    const {table, columns, values, where, returning} = this.descriptor
    const valuePlaceholders = createValuePlaceholders(1, values.length)
    let whereClause = ''
    if (where) {
      const whereKeys = Object.keys(where)
      if (whereKeys.length > 0) {
        whereClause = ' WHERE'
        const valuePlaceHolders = createValuePlaceholders(values.length + 1, whereKeys.length)
        whereKeys.forEach((key, index) => {
          whereClause += ` AND ${key} = ${valuePlaceHolders[index]}`
        })
        whereClause = whereClause.replace(' AND', '')
      }
    }
    return `UPDATE ${table} SET (${columns.join(', ')}) = (${valuePlaceholders.join(',')}) ${whereClause} RETURNING ${returning.join(', ')};`
  }
}

class DeleteQueryBuilder {
  constructor () {
    this.descriptor = {}
  }

  from (table) {
    this.descriptor.table = table
    return this
  }

  where (where) {
    this.descriptor.where = where
    return this
  }

  build () {
    const {table, where} = this.descriptor

    let whereClause = ''
    if (where) {
      const whereKeys = Object.keys(where)
      if (whereKeys.length > 0) {
        whereClause = ' WHERE'
        const valuePlaceHolders = createValuePlaceholders(1, whereKeys.length)
        whereKeys.forEach((key, index) => {
          whereClause += ` AND ${key} = ${valuePlaceHolders[index]}`
        })
        whereClause = whereClause.replace(' AND', '')
      }
    }

    return `DELETE FROM ${table} ${whereClause};`
  }
}

class QueryBuilder {
  select (columns) {
    return new SelectQueryBuilder().columns(columns)
  }

  insert () {
    return new InsertQueryBuilder()
  }

  update (table) {
    return new UpdateQueryBuilder().table(table)
  }

  delete () {
    return new DeleteQueryBuilder()
  }
}

class Model {
  static get properties () {
    throw new Error(`No properties have been defined for ${this.tableName}`)
  }

  static get tableName () {
    return this.name
  }

  get tableName () {
    return this.constructor.tableName
  }

  static async findAll () {
    const columns = ['id', 'createdAt', 'updatedAt', ...this.properties]
    const sql = new QueryBuilder().select(columns).from(this.tableName).build()
    console.log(sql)
    const dbResult = await pool.query(sql)
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

class Derived extends Model {
  static get properties () {
    return ['apple', 'banana', 'orange']
  }
}

pool.query(`CREATE TABLE IF NOT EXISTS Derived (
  id          SERIAL PRIMARY KEY,
  apple       integer NOT NULL,
  banana      varchar(40) NOT NULL,
  orange      integer NOT NULL,
  createdAt   date,
  updatedAt   date
);`, (err, res) => {
  if (err) {
    throw err
  }

  const derived = new Derived()
  derived.apple = 100
  derived.banana = 'still gross'
  derived.orange = 19
  derived.save().then((created) => {
    console.log(created)
    created.banana = 'always gross'
    created.save().then((updated) => {
      console.log(updated)
      Derived.findAll().then((results) => {
        const promises = []
        for (const result of results) {
          console.log(result)
          promises.push(result.destroy())
        }

        Promise.all(promises).then((deletions) => {
          for (const deletion of deletions) {
            console.log(deletion)
          }
          pool.end()
        })
      })
    })
  })
})

