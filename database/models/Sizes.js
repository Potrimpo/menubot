module.exports = function (sequelize, Sequelize) {

  return sequelize.define('Size', {
    fbid: {
      type: Sequelize.BIGINT,
      references: {
        model: 'companies',
        key: 'fbid'
      },
    },
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
