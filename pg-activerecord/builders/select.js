const {createValuePlaceholders} = require('./util')

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

  where (where) {
    this.descriptor.where = where
    return this
  }

  build () {
    const { columns, table, where } = this.descriptor

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

    return `SELECT ${columns.join(', ')} FROM ${table}${whereClause};`
  }
}
