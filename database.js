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
  tableName: 'types'
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
  tableName: 'types'
});


module.exports = {
  sequelize,
  Company,
  Item,
  Type,
  Size
};