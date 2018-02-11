const path = require('path')
const glob = require('glob')
const cwd = process.cwd()

class GlobalManager {
  constructor () {
    this.refresh()
  }

  refresh () {
    this.controllers = glob.sync('controllers/**/*-controller.js')
    this.models = glob.sync('models/**/*.js')
    this.context = [].concat(this.controllers).concat(this.models).reduce(function (globals, file) {
      const clazz = require(path.join(cwd, file.substring(0, file.length-3)))
      globals[clazz.name] = clazz
      return globals
    }, {})
  }
}

module.exports = new GlobalManager()
