module.exports = class BelongsTo {
  constructor (TargetModel, OtherModel, options = {}) {
    this.TargetModel = TargetModel
    this.OtherModel = OtherModel
    this.options = options
  }

  get referenceId () {
    return this.options.through || `${this.OtherModel.tableName.toLowerCase()}Id`
  }

  get propertyName () {
    return this.OtherModel.name
  }

  action (instance) {
    return this.OtherModel.findOne({
      where: {
        id: instance[this.referenceId]
      }
    })
  }
}
