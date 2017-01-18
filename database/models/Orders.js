module.exports = function (sequelize, Sequelize) {

  return sequelize.define('Order', {
    orderid: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fbid: {
      type: Sequelize.BIGINT,
      references: {
        model: 'companies',
        key: 'fbid'
      }
    },
    customer_id: {
      type: Sequelize.BIGINT,
      references: {
        model: 'customers',
        key: 'customer_id'
      }
    },
    sizeid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'sizes',
        key: 'sizeid'
      },
    },
    typeid: {
      type: Sequelize.INTEGER,
      references: {
        model: 'types',
        key: 'typeid'
      },
    },
    itemid: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'items',
        key: 'itemid'
      },
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    pickuptime: {
      type: Sequelize.DATE,
      allowNull: false
    },
    pending: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    notified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'orders',
    // could benefit from adding timestamps in future
    timestamps: false,
  });

};
