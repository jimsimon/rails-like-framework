import { Element } from './node_modules/@polymer/polymer/polymer-element.js'
import './node_modules/@polymer/app-layout/app-drawer-layout/app-drawer-layout.js'
import './node_modules/@polymer/app-layout/app-drawer/app-drawer.js'
import './node_modules/@polymer/app-layout/app-header-layout/app-header-layout.js'
import './node_modules/@polymer/app-layout/app-header/app-header.js'
import './node_modules/@polymer/app-layout/app-toolbar/app-toolbar.js'
import './node_modules/@polymer/paper-icon-button/paper-icon-button.js'
import './node_modules/@polymer/iron-icons/iron-icons.js'
import './node_modules/@polymer/iron-selector/iron-selector.js'
import './node_modules/page.js/page.js'
import './pages/budget-page.js'
import './pages/accounts-page.js'
import './pages/page-not-found.js'

customElements.define('budget-app', class BudgetApp extends Element {
  static get template() {
    return `
      <style>
        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }
      </style>
      <app-drawer-layout>
        <app-drawer slot="drawer">
          <nav>
            <iron-selector>
              <a on-click="_navigate" href="/budget-page">Budget</a>
              <a on-click="_navigate" href="/accounts-page">Accounts</a>
            </iron-selector>
          </nav>
        </app-drawer>
        <app-header-layout>
          <app-header slot="header">
            <app-toolbar>
              <paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
              <div main-title>Budget App</div>
            </app-toolbar>
          </app-header>
          <div id="content"></div>
        </app-header-layout>
      </app-drawer-layout>
    `
  }

  connectedCallback () {
    super.connectedCallback()
    this._setupRoutes()
  }

  _navigate (event) {
    event.stopPropagation()
    event.preventDefault()
    page(event.target.pathname)
  }

  _setupRoutes() {
    page.redirect('/', '/budget-page')

    this.addRoute(
      '/budget-page',
      '<budget-page></budget-page>'
    )

    this.addRoute(
      '/accounts-page',
      '<accounts-page></accounts-page>'
    )

    this.addRoute(
      '*',
      '<page-not-found></page-not-found>'
    )

    page.start()
  }

  addRoute(path, html) {
    page(path, () => {
      this.renderPage(html)
    })
  }

  renderPage(html) {
    const template = document.createElement('template')
    template.innerHTML = html
    const stampedTemplate = this._stampTemplate(template)
    const currentFragment = this.$.content.firstChild
    if (currentFragment) {
      this.$.content.replaceChild(stampedTemplate, currentFragment)
    } else {
      this.$.content.appendChild(stampedTemplate)
    }
  }
})
