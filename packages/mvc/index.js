#!/usr/bin/env node

const program = require('commander')
const version = require('./package.json').version

program
  .version(version)

program
  .command('init')
  .action(function () {
    return ('./commands/init')
  })

program
  .command('server')
  .action(function () {
    require('./commands/server')
  })

program
  .command('console')
  .action(function () {
    require('./commands/console')
  })


program.parse(process.argv)
