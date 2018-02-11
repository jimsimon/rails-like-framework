#!/usr/bin/env node

const program = require('commander')
const version = require('./package.json').version

program
  .version(version)

program
  .command('server')
  .action(function () {
    require('./server')
  })

program
  .command('console')
  .action(function () {
    require('./console')
  })


program.parse(process.argv)
