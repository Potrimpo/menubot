module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.createTable('testertable',
      {
        keyer: {
          type: Sequelize.STRING,
        }
      })
  },

  down (queryInterface, Sequelize) {
    return queryInterface.dropTable('testertable');
  }
};