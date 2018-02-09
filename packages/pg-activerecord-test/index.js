(async function () {
  const pool = require('pg-activerecord/pool')
  const Model = require('pg-activerecord/model')

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
CREATE TABLE IF NOT EXISTS "Derived" (
  id            SERIAL PRIMARY KEY,
  apple         integer NOT NULL,
  banana        varchar(40) NOT NULL,
  orange        integer NOT NULL,
  "createdAt"   date,
  "updatedAt"   date
);

CREATE TABLE IF NOT EXISTS "OtherDerived" (
  id            SERIAL PRIMARY KEY,
  "derivedId"   integer NOT NULL REFERENCES "Derived"(id),
  name          varchar(40) NOT NULL,
  "createdAt"   date,
  "updatedAt"   date
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
    console.log(await otherCreated.Derived)

    const otherDeriveds = await created.OtherDerived
    console.log(otherDeriveds)

    created.banana = 'always gross'
    const updated = await created.save()
    console.log(updated)

    const results = await OtherDerived.findAll()
    const promises = []
    for (const result of results) {
      console.log(result)
      promises.push(result.destroy())
    }
    const deletions = await Promise.all(promises)
    for (const deletion of deletions) {
      console.log(deletion)
    }
    const results2 = await Derived.findAll()
    const promises2 = []
    for (const result of results2) {
      console.log(result)
      promises2.push(result.destroy())
    }
    const deletions2 = await Promise.all(promises)
    for (const deletion of deletions2) {
      console.log(deletion)
    }

    const jsonDerived = new Derived()
    jsonDerived.apple = 1234
    jsonDerived.banana = 'hmmm'
    jsonDerived.orange = 42
    console.log(JSON.stringify(jsonDerived))

    pool.end()
})()

