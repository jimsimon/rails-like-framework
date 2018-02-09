const chokidar = require('chokidar')
const invalidate = require('invalidate-module')
const path = require('path')

let server = require('./app')

// Watch for file changes and reload the server
chokidar.watch('.', {
  ignoreInitial: true,
  ignored: [/(^|[\/\\])\../, '**/node_modules/**']
}).on('change', (filepath) => {
  console.log('Change detected')
  const absFilename = path.resolve(filepath)
  invalidate(absFilename)
  console.log('Closing current server')
  server.close(() => {
    console.log('Starting new server')
    try {
      server = require('./app')
    } catch (e) {
      console.error(e)
    }
  })
})

