const Sequelize = require('sequelize'),
  { sessionTable } = require('../../envVariables'),
  bcrypt = require('bcrypt-nodejs');

const sequelize = new Sequelize(
  `postgres://postgres:${process.env.postgresPassword}@${process.env.postgresURL}:5432/menubot`,
  {
    dialect: 'postgres',
    maxConcurrentQueries: 100
  }
);

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
  token: Sequelize.STRING,
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
  access_token: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bot_status: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: Sequelize.STRING
}, {
  tableName: 'companies',
  timestamps: false,
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
  },
  photo: {
    type: Sequelize.STRING
  },
  item_price: {
    type: Sequelize.DECIMAL
  }
}, {
  tableName: 'items',
  timestamps: false,
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
  },
  photo: {
    type: Sequelize.STRING
  },
  type_price: {
    type: Sequelize.DECIMAL
  }
}, {
  tableName: 'types',
  timestamps: false,
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
  size_price: {
    type: Sequelize.DECIMAL
  }
}, {
  tableName: 'sizes',
  timestamps: false,
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
    references: {
      model: 'items',
      key: 'itemid'
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
});

const Customer = sequelize.define('Customer', {
  customer_id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    allowNull: false
  },
  profile_pic: Sequelize.STRING,
  customer_name: Sequelize.STRING
}, {
  tableName: 'customers',
  timestamps: false
});

// Relations
// User.belongsToMany(Company, { through: 'usercompany' });
// Company.belongsToMany(User, { through: 'usercompany' });

Item.belongsTo(Company, { foreignKey: 'fbid', onDelete: 'cascade' });
Type.belongsTo(Item, { foreignKey: 'itemid', onDelete: 'cascade' });
Size.belongsTo(Type, { foreignKey: 'typeid', onDelete: 'cascade' });

Order.belongsTo(Size, { foreignKey: 'sizeid', onDelete: 'cascade' });
Order.belongsTo(Type, { foreignKey: 'typeid', onDelete: 'cascade' });
Order.belongsTo(Item, { foreignKey: 'itemid', onDelete: 'cascade' });
Order.belongsTo(Company, { foreignKey: 'fbid', onDelete: 'cascade' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', onDelete: 'cascade' });


module.exports = {
  sequelize,
  Company,
  Item,
  Type,
  Size,
  Order,
  Session,
  User,
  Customer
};
