'use strict'

const fs = require('fs')
const path = require('path')
const basename = path.basename(module.filename)

const models = Object.assign({}, ...fs.readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .map(function (file) {
    const clazz = require(path.join(__dirname, file))
    const className = clazz.name
    return {
      [className]: clazz
    }
  })
)

// Load model associations
for (const model of Object.keys(models)) {
  typeof models[model].associate === 'function' && models[model].associate(models)
}

module.exports = models
