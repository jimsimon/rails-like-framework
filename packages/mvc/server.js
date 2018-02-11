const path = require('path')
const express = require('express')
const shardingMiddleware = require('../pg-activerecord/sharding/middleware')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const compression = require('compression')
// const Umzug = require('umzug')
const forceSSL = require('express-force-ssl')
const env = process.env.NODE_ENV || 'development'
const loadConfig = require('utils/loadConfig')
const config = loadConfig('config')

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

app.use(shardingMiddleware)

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
  // app.use('/', router)
} else {
  // app.use('/', forceSSL, router)
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

const cwd = process.cwd()

const vm = require('vm')
const fs = require('fs')
const code = fs.readFileSync(path.join(cwd, 'config', 'routes.js'), 'utf8')

const humps = require('humps')
class RouterBuilder {
  constructor (globals) {
    this.router = express.Router()
    this.globals = globals
  }

  resources (controllerName) {
    this.get(`/${controllerName}`, controllerName, 'index')
    this.post(`/${controllerName}`, controllerName, 'create')
    this.get(`/${controllerName}/:id`, controllerName, 'show')
    this.put(`/${controllerName}/:id`, controllerName, 'update')
    this.patch(`/${controllerName}/:id`, controllerName, 'update')
    this.delete(`/${controllerName}/:id`, controllerName, 'destroy')
  }

  get (path, controllerName, controllerFunction) {
    this._setupRoute('get', path, controllerName, controllerFunction)
  }

  put (path, controllerName, controllerFunction) {
    this._setupRoute('put', path, controllerName, controllerFunction)
  }

  post (path, controllerName, controllerFunction) {
    this._setupRoute('post', path, controllerName, controllerFunction)
  }

  delete (path, controllerName, controllerFunction) {
    this._setupRoute('delete', path, controllerName, controllerFunction)
  }

  patch (path, controllerName, controllerFunction) {
    this._setupRoute('patch', path, controllerName, controllerFunction)
  }

  _setupRoute (verb, path, controllerName, controllerFunction) {
    const className = `${humps.pascalize(controllerName)}Controller`
    const globals = this.globals
    this.router[verb](path, function (...params) {
      const controller = new globals[className]()
      return controller[controllerFunction](...params)
    })
  }
}

const glob = require('glob')
const controllers = glob.sync('controllers/**/*-controller.js')
const models = glob.sync('models/**/*.js')
const globals = [].concat(controllers).concat(models).reduce(function (globals, file) {
  const clazz = require(path.join(cwd, file.substring(0, file.length-3)))
  globals[clazz.name] = clazz
  return globals
}, {})

console.log(globals)
const routerBuilder = new RouterBuilder(globals)
vm.runInNewContext(code, {resources: routerBuilder.resources.bind(routerBuilder)})

app.use(routerBuilder.router)

try {
  module.exports = app.listen(3000, function () {
    console.log('API listening on port 3000!')
  })
} catch (e) {
  console.log(e)
}