const Sequelize = require('sequelize'),
  { postgresURL, sessionTable } = require('../../envVariables'),
  bcrypt = require('bcrypt-nodejs');

const sequelize = new Sequelize(postgresURL, { maxConcurrentQueries: 100 });

// Sessions table
const Session = sequelize.define('Session', {
  sid: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  sess: {
    type: Sequelize.JSON,
    allowNull: false
  },
  expire: {
    type: Sequelize.DATE(6),
    allowNull: false
  }
}, {
  tableName: sessionTable,
  timestamps: false
});

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  facebookId: {
    type: Sequelize.STRING,
    unique: true
  },
  name: Sequelize.STRING,
  photo: Sequelize.STRING,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    isEmail: true
  },
  accounts: Sequelize.JSON,
  tokens: Sequelize.JSON
}, {
  tableName: 'pl_users',
  indexes: [
    {
      name: 'facebookIdIndex',
      method: 'BTREE',
      fields: ['facebookId']
    }
  ]
});

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
  timestamps: false,
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
  timestamps: false,
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
  timestamps: false,
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
  timestamps: false,
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
  },
  pending: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'orders',
  // could benefit from adding timestamps in future
  timestamps: false,
  classMethods: {
    makeOrder(fbid, userid, typeid, sizeid, pickuptime) {
      return Order.build({
        fbid, userid, typeid, sizeid, pickuptime
      }).save();
    },
    findOrder (fbid, userid, sizeid) {
      return Order.findOne({
        attributes: ['pickuptime'],
        where: {fbid, userid, sizeid}
      })
        .catch(err => console.error("error in Order.findOrder:", err.message || err));
    }
  }
});

// Relations
User.belongsToMany(Company, { through: 'usercompany' });
Company.belongsToMany(User, { through: 'usercompany' });

Item.belongsTo(Company, { foreignKey: 'fbid' });
Type.belongsTo(Item, { foreignKey: 'itemid', onDelete: 'cascade' });
Size.belongsTo(Type, { foreignKey: 'typeid', onDelete: 'cascade' });

Order.belongsTo(Size, { foreignKey: 'sizeid', onDelete: 'cascade' });
Order.belongsTo(Type, { foreignKey: 'typeid', onDelete: 'cascade' });
Order.belongsTo(Company, { foreignKey: 'fbid', onDelete: 'cascade' });


module.exports = {
  sequelize,
  Company,
  Item,
  Type,
  Size,
  Order,
  Session,
  User
};
