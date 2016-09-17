/**
 * Created by lewis.knoxstreader on 17/09/16.
 */

const Sequelize = require('sequelize'),
  { postgresURL } = require('./envVariables');

const sequelize = new Sequelize(postgresURL, { maxConcurrentQueries: 100 });


const Company = sequelize.define('Company', {
  fbid: {
    type: Sequelize.BIGINT,
    unique: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: Sequelize.STRING
}, {
  tableName: 'companies',
  classMethods: {
    findLocation(fbid) {
      return Company.findOne({
        attributes: ['location'],
        where: { fbid }
      })
    }
  }
});


const Item = sequelize.define('Item', {
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
  }
}, {
  tableName: 'items',
  classMethods: {
    findItem(fbid, item) {
      return Item.findOne({
        attributes: ['item', 'itemid'],
        where: { fbid, item }
      })
    },
    getMenu(fbid) {
      return Item.findAll({
        attributes: ['item', 'itemid'],
        where: { fbid }
      })
    }
  }
});

const Type = sequelize.define('Type', {
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
  }
}, {
  tableName: 'types',
  classMethods: {
    getTypes(itemid) {
      return Type.findAll({
        attributes: ['itemid', 'typeid', 'type'],
        where: { itemid }
      })
    }
  }
});

const Size = sequelize.define('Size', {
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
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false
  }
}, {
  tableName: 'sizes',
  classMethods: {
    getSizes(typeid) {
      return Size.findAll({
        attributes: ['typeid', 'sizeid', 'size', 'price'],
        where: { typeid }
      })
    },
    orderDetails(sizeid) {
      return sequelize.query(
        "SELECT sizes.sizeid, sizes.typeid, types.itemid, sizes.size, type, item" +
        " FROM sizes INNER JOIN types ON sizes.typeid=types.typeid" +
        " INNER JOIN items ON types.itemid=items.itemid" +
        " WHERE sizes.sizeid=$1",
        { bind: [sizeid], type: sequelize.QueryTypes.SELECT }
      );
      }
    }
});


const Order = sequelize.define('Order', {
  orderid: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  fbid: {
    type: Sequelize.BIGINT,
    references: {
      model: 'companies',
      key: 'fbid'
    }
  },
  userid: {
    type: Sequelize.BIGINT,
    allowNull: false
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
    references: {
      model: 'sizes',
      key: 'sizeid'
    },
  },
  pickuptime: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
  tableName: 'orders',
  classMethods: {
    makeOrder(fbid, userid, typeid, sizeid, pickuptime) {
      return Order.build({
        fbid, userid, typeid, sizeid, pickuptime
      })
      .save()
    },
  }
});


module.exports = {
  sequelize,
  Company,
  Item,
  Type,
  Size
};