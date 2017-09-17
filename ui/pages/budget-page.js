import { Element } from '../node_modules/@polymer/polymer/polymer-element.js'
import '../components/category-group.js'

customElements.define('budget-page', class BudgetApp extends Element {
  static get properties () {
    return {
      budget: {
        type: Object,
        value: {
          id: 1,
          label: 'My Budget',
          categoryGroups: [
            {
              id: 1,
              label: 'Group 1',
              categories: [
                {
                  id: 1,
                  label: 'Stuff 1',
                  budgeted: 0,
                  activity: 100
                },
                {
                  id: 2,
                  label: 'Stuff 2',
                  budgeted: 50,
                  activity: 200
                }
              ]
            },
            {
              id: 2,
              label: 'Group 1',
              categories: [
                {
                  id: 3,
                  label: 'Stuff 3',
                  budgeted: 99,
                  activity: 1000
                },
                {
                  id: 4,
                  label: 'Stuff 4',
                  budgeted: 20,
                  activity: 20
                }
              ]
            }
          ]
        }
      }
    }
  }

  static get template () {
    return `
      <h1>[[budget.label]]</h1>
      <template is="dom-repeat" items="[[budget.categoryGroups]]" as="group">
        <category-group category-group="[[group]]"></category-group>
      </template>
    `
  }
})
