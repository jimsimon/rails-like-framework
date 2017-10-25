module.exports = class HasMany {
  constructor (TargetModel, OtherModel, options = {}) {
    this.TargetModel = TargetModel
    this.OtherModel = OtherModel
    this.options = options
  }

  get referenceId () {
    return this.options.through || `${this.TargetModel.tableName.toLowerCase()}Id`
  }

  get getterName () {
    return `get${this.OtherModel.name}`
  }

  action (instance) {
    return this.OtherModel.findAll({
      where: {
        [this.referenceId]: instance.id
      }
    })
  }
}