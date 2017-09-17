import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'

customElements.define('category-group', class BudgetApp extends Element {
  static get properties () {
    return {
      categoryGroup: Object
    }
  }

  static get template () {
    return `
      <table>
        <caption>[[categoryGroup.label]]</caption>
        <thead>
          <tr><th>Category Name</th><th>Budgeted</th><th>Activity</th><th>Available</th></tr>
        </thead>
        <tbody>
          <template is="dom-repeat" items="[[categoryGroup.categories]]" as="category">
            <tr>
              <td>[[category.label]]</td>
              <td>[[category.budgeted]]</td>
              <td>[[category.activity]]</td>
              <td>[[computeAvailable(category.budgeted, category.activity)]]</td>
            </tr>
          </template>
        </tbody>
      </table>
    `
  }

  computeAvailable (budgeted, activity) {
    return budgeted - activity
  }
})
