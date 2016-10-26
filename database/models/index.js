const Sequelize = require('sequelize'),
  { postgresURL, serverIP, postgresPassword, sessionTable } = require('../../envVariables'),
  bcrypt = require('bcrypt-nodejs');

const sequelize = new Sequelize(`postgres://${postgresPassword}@${postgresURL}:5432/menubot`, {
  dialect: 'postgres',
  maxConcurrentQueries: 100,
});

// const sequelize = new Sequelize('menubot', 'postgres', postgresPassword, {
//   host: postgresURL,
//   port: 5432,
//   maxConcurrentQueries: 100,
//   dialect: 'postgres',
// });

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
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false
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
  userid: {
    type: Sequelize.BIGINT,
    allowNull: false
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
