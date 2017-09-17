const pool = require('./pool')
const Model = require('./model')

class Derived extends Model {
  static get properties () {
    return ['apple', 'banana', 'orange']
  }
}

pool.query(`CREATE TABLE IF NOT EXISTS Derived (
  id          SERIAL PRIMARY KEY,
  apple       integer NOT NULL,
  banana      varchar(40) NOT NULL,
  orange      integer NOT NULL,
  createdAt   date,
  updatedAt   date
);`, (err, res) => {
  if (err) {
    throw err
  }

  const derived = new Derived()
  derived.apple = 100
  derived.banana = 'still gross'
  derived.orange = 19
  derived.save().then((created) => {
    console.log(created)
    created.banana = 'always gross'
    created.save().then((updated) => {
      console.log(updated)
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
})

