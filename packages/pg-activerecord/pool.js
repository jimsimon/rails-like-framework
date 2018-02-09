const loadConfig = require('utils/loadConfig')
const {Pool} = require('pg')

const environment = process.env.NODE_ENV || 'development'
const config = loadConfig('database')[environment]

const pool = new Pool({
  user: config.username,
  host: config.host,
  port: config.port,
  database: config.database,
  password: config.password
})

module.exports = pool
