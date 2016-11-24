/**
 * Created by lewis.knoxstreader on 24/11/16.
 */

module.exports = function (sequelize, Sequelize) {

  return sequelize.define('Type', {
    itemid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'items',
        key: 'itemid'
      },
    },
    typeid: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: Sequelize.STRING
    },
    type_photo: {
      type: Sequelize.STRING
    },
    type_price: {
      type: Sequelize.DECIMAL
    }
  }, {
    tableName: 'types',
    timestamps: false,
  });

};
