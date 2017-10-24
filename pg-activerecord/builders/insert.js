const {createValuePlaceholders} = require('./util')

module.exports = class InsertQueryBuilder {
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
