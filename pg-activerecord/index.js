(async function () {
  const pool = require('./pool')
  const Model = require('./model')

  class Derived extends Model {
    static get properties () {
      return ['apple', 'banana', 'orange']
    }
  }

  class OtherDerived extends Model {
    static get properties () {
      return ['derivedId', 'name']
    }
  }

  Derived.hasMany(OtherDerived)
  OtherDerived.belongsTo(Derived)

  await pool.query(`
CREATE TABLE IF NOT EXISTS Derived (
  id          SERIAL PRIMARY KEY,
  apple       integer NOT NULL,
  banana      varchar(40) NOT NULL,
  orange      integer NOT NULL,
  createdAt   date,
  updatedAt   date
);

CREATE TABLE IF NOT EXISTS OtherDerived (
  id          SERIAL PRIMARY KEY,
  derivedId   integer NOT NULL REFERENCES Derived(id),
  name        varchar(40) NOT NULL,
  createdAt   date,
  updatedAt   date
);

`)

    const derived = new Derived()
    derived.apple = 100
    derived.banana = 'still gross'
    derived.orange = 19
    const created = await derived.save()
    console.log(created)

    const otherDerived = new OtherDerived()
    otherDerived.derivedId = created.id
    otherDerived.name = 'something else'
    const otherCreated = await otherDerived.save()
    console.log(otherCreated)
    console.log(await otherCreated.getDerived())

    const otherDeriveds = await created.getOtherDerived()
    console.log(otherDeriveds)

    created.banana = 'always gross'
    const updated = await created.save()
    console.log(updated)

    OtherDerived.findAll().then((results) => {
      const promises = []
      for (const result of results) {
        console.log(result)
        promises.push(result.destroy())
      }
      Promise.all(promises).then((deletions) => {
        for (const deletion of deletions) {
          console.log(deletion)
        }
        Derived.findAll().then((results) => {
          const promises = []
          for (const result of results) {
            console.log(result)
            promises.push(result.destroy())
          }
          Promise.all(promises).then((deletions) => {
            for (const deletion of deletions) {
              console.log(deletion)
            }
            pool.end()
          })
        })
      })
    })
})()
