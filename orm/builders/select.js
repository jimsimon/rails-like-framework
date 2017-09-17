module.exports = class SelectQueryBuilder {
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
