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
      primaryKey: true
    },
    item: {
      type: Sequelize.STRING
    },
    item_description: {
      type: Sequelize.STRING,
      validate: {
        max: 80
      }
    },
    item_photo: {
      type: Sequelize.STRING
    },
    item_price: {
      type: Sequelize.DECIMAL
    },
    use_options: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'items',
    timestamps: false,
  });

};
