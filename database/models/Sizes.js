/**
 * Created by lewis.knoxstreader on 24/11/16.
 */

module.exports = function (sequelize, Sequelize) {

  return sequelize.define('Size', {
    typeid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'types',
        key: 'typeid'
      },
    },
    sizeid: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    size: {
      type: Sequelize.STRING
    },
    size_price: {
      type: Sequelize.DECIMAL
    }
  }, {
    tableName: 'sizes',
    timestamps: false,
  });

};
