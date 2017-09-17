'use strict'

const fs = require('fs')
const path = require('path')
const basename = path.basename(module.filename)
const { sequelize, Sequelize } = require('../util/sequelize')

const models = Object.assign({}, ...fs.readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .map(function (file) {
    const clazz = require(path.join(__dirname, file))
    const className = clazz.name
    const modelName = className.charAt(0).toLowerCase() + className.slice(1)
    return {
      [className]: clazz.init(clazz.fields, {
        modelName,
        sequelize
      })
    }
  })
)

// Load model associations
for (const model of Object.keys(models)) {
  typeof models[model].associate === 'function' && models[model].associate(models)
}

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models
