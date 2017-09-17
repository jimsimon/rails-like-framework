import Router from './node_modules/middle-router/lib/router.js'
import './pages/budget-page.js'
import './pages/accounts-page.js'
import './pages/page-not-found.js'

export default Router()
  .use('/budget-page', function ({ resolve }) {
    resolve('<budget-page></budget-page>')
  })
  .use('/accounts-page', function ({ resolve }) {
    resolve('<accounts-page></accounts-page>')
  })
  .use('*', function ({ resolve }) {
    resolve('<page-not-found></page-not-found>')
  })
