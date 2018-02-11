const humps = require('humps')
const express = require('express')

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

module.exports = RouterBuilder
