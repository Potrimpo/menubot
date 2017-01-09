module.exports = function (sequelize, Sequelize) {

    return sequelize.define('Key', {
      password: {
        type: Sequelize.STRING,
      },
      number: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      }
    }, {
      tableName: 'keys',
      timestamps: false,
  });

};
