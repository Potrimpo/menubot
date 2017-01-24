module.exports = function (sequelize, Sequelize) {

  return sequelize.define('Type', {
    fbid: {
      type: Sequelize.BIGINT,
      references: {
        model: 'companies',
        key: 'fbid'
      },
    },
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
