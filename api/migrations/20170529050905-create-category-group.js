'use strict'
module.exports = {
  up: async function(queryInterface, Sequelize) {
    await queryInterface.createTable('categoryGroups', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      label: {
        allowNull: false,
        type: Sequelize.STRING
      },
      budgetId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'budgets',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: new Date(),
        type: Sequelize.DATE
      }
    })
  },
  down: function(queryInterface) {
    return queryInterface.dropTable('categoryGroups')
  }
}
