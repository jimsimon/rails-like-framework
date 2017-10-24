const SelectQueryBuilder = require('./select')
const InsertQueryBuilder = require('./insert')
const UpdateQueryBuilder = require('./update')
const DeleteQueryBuilder = require('./delete')

module.exports = class QueryBuilder {
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
