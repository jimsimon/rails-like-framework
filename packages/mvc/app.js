const express = require('express')
// const shardingMiddleware = require('../api/sharding/middleware')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
// const Umzug = require('umzug')
const forceSSL = require('express-force-ssl')
// const router = require('../api/router/router')
const env = process.env.NODE_ENV || 'development'
// const { sequelize } = require('../api/util/sequelize')

const app = express()
app.set('forceSSLOptions', {
  trustXFPHeader: true
})

// const umzug = new Umzug({
//   storage: 'sequelize',
//   storageOptions: {
//     sequelize
//   }
// })

app.use(morgan('combined'))
app.use(compression())

// app.use(shardingMiddleware)

// app.use('*', async function (req, res, next) {
//   if (env === 'production') {
//     return next()
//   }
//
//   try {
//     const migrations = await umzug.pending()
//     if (migrations && migrations.length > 0) {
//       res.status(500).send("You have pending database migrations, please run them before continuing.")
//     } else {
//       const {getNamespace} = require('cls-hooked')
//       const shardingNamespace = getNamespace('sharding')
//       console.log('MW: ' + shardingNamespace.get('shard'))
//       next()
//     }
//   } catch (e) {
//     next(e)
//   }
// })

app.use(bodyParser.json())

if (env === 'development') {
  app.use('/', router)
} else {
  app.use('/', forceSSL, router)
}

// app.use(function (err, req, res, next) {
//   if (res.headersSent) {
//     return next(err)
//   }
//   res.status(500)
//   res.send(`
//     <h1>Error Report</h1>
//     <p>${err.message}</p>
//     <p>${err.stack}</p>
//   `)
// })

try {
  module.exports = app.listen(3000, function () {
    console.log('API listening on port 3000!')
  })
} catch (e) {
  console.log(e)
}

