/**
 * Created by lewis.knoxstreader on 24/11/16.
 */

module.exports = function (sequelize, Sequelize) {

  return sequelize.define('Item', {
    fbid: {
      type: Sequelize.BIGINT,
      references: {
        model: 'companies',
        key: 'fbid'
      },
    },
    itemid: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    item: {
      type: Sequelize.STRING
    },
    item_photo: {
      type: Sequelize.STRING
    },
    item_price: {
      type: Sequelize.DECIMAL
    }
  }, {
    tableName: 'items',
    timestamps: false,
  });

};
