const Sequelize = require('sequelize'),
  bcrypt = require('bcrypt-nodejs');

const sequelize = new Sequelize(
  `postgres://postgres:${process.env.postgresPassword}@${process.env.postgresURL}:5432/menubot`,
  {
    dialect: 'postgres',
    maxConcurrentQueries: 100,
    logging: false
  }
);

const Session = sequelize.import("./Sessions"),
  User = sequelize.import("./Users"),
  Company = sequelize.import("./Companies"),
  Item = sequelize.import("./Items"),
  Type = sequelize.import("./Types"),
  Size = sequelize.import("./Sizes"),
  Order = sequelize.import("./Orders"),
  Customer = sequelize.import("./Customers");

// Relations
Item.belongsTo(Company, { foreignKey: 'fbid', onDelete: 'cascade' });
Type.belongsTo(Item, { foreignKey: 'itemid', onDelete: 'cascade' });
Size.belongsTo(Type, { foreignKey: 'typeid', onDelete: 'cascade' });

Order.belongsTo(Size, { foreignKey: 'sizeid', onDelete: 'cascade' });
Order.belongsTo(Type, { foreignKey: 'typeid', onDelete: 'cascade' });
Order.belongsTo(Item, { foreignKey: 'itemid', onDelete: 'cascade' });
Order.belongsTo(Company, { foreignKey: 'fbid', onDelete: 'cascade' });
Order.belongsTo(Customer, { foreignKey: 'customer_id', onDelete: 'cascade' });

// User.belongsToMany(Company, { through: 'usercompany' });
// Company.belongsToMany(User, { through: 'usercompany' });

module.exports = {
  sequelize,
  Session,
  User,
  Company,
  Item,
  Type,
  Size,
  Order,
  Customer
};
