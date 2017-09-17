const {createValuePlaceholders} = require('./util')

module.exports = class UpdateQueryBuilder {
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
