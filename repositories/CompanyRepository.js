/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const { sequelize, Company, User, Item, Type, Size, Order } = require('../database/models/index');

exports.findUserCompanies = (accounts => {
  return Company.findAll({
    attributes: ['fbid', 'name'],
    where: { fbid: { $or: accounts } }
  })
});

exports.findCompany = (id) => Company.findById(id, { attributes: ['name', 'fbid'] });

exports.getCompanyMenu = id => {
  return sequelize.query(
    "SELECT companies.name, items.item, items.itemid FROM companies" +
    " INNER JOIN items ON companies.fbid = items.fbid" +
    " WHERE companies.fbid = $1",
    { bind: [id], type: sequelize.QueryTypes.SELECT }
  );
};

// exports.getCompanyMenuDavidLeetRemixVer = id => {
//   return Company.find({ where: {fbid: id}})
// };

exports.getMenuTypes = itemids => {
  return sequelize.query(
    "SELECT types.itemid, type, typeid FROM items" +
    " INNER JOIN types ON items.itemid = types.itemid" +
    " WHERE items.itemid IN (:itemids)",
    { replacements: { itemids }, type: sequelize.QueryTypes.SELECT }
  );
};

exports.getMenuSizes = typeids => {
  return sequelize.query(
    "SELECT sizes.typeid, size, sizeid, price FROM types" +
    " INNER JOIN sizes ON types.typeid = sizes.typeid" +
    " WHERE types.typeid IN (:typeids)",
    { replacements: { typeids }, type: sequelize.QueryTypes.SELECT }
  );
};

exports.insertMenuVal = (data) => {
  return sequelize.query(
    "INSERT INTO items (fbid, item)" +
    " VALUES (:fbid, :item)" +
    " RETURNING itemid",
    { replacements: { fbid: data.fbid, item: data.item }, type: sequelize.QueryTypes.INSERT }
  )
    .then(val => {
      console.log("value from insertion =", val);
      return sequelize.query(
        "INSERT INTO types (itemid, type)" +
        " VALUES (:itemid, :type)" +
        " RETURNING typeid",
        { replacements: { type: data.type, itemid: val[0].itemid }, type: sequelize.QueryTypes.INSERT }
      )
    })
    .then(val => {
      console.log("value from insertion =", val);
      return sequelize.query(
        "INSERT INTO sizes (typeid, size, price)" +
        " VALUES (:typeid, :size, :price)",
        { replacements: { typeid: val[0].typeid, size: data.size, price: data.price }, type: sequelize.QueryTypes.INSERT }
      )
    })
    .catch(err => console.error("error inserting menu item:", err));
};

exports.insertType = data => {
    return sequelize.query(
      "INSERT INTO types (itemid, type)" +
      " VALUES (:itemid, :type)" +
      " RETURNING typeid",
      { replacements: { type: data.type, itemid: data.parentId }, type: sequelize.QueryTypes.INSERT }
    )
    .then(val => {
      console.log("value from insertion =", val);
      return sequelize.query(
        "INSERT INTO sizes (typeid, size, price)" +
        " VALUES (:typeid, :size, :price)",
        { replacements: { typeid: val[0].typeid, size: data.size, price: data.price }, type: sequelize.QueryTypes.INSERT }
      )
    })
    .catch(err => console.error("error inserting new type:", err));
};

exports.insertSize = data => {
  return sequelize.query(
    "INSERT INTO sizes (typeid, size, price)" +
    " VALUES (:typeid, :size, :price)",
    { replacements: { typeid: data.parentId, size: data.size, price: data.price }, type: sequelize.QueryTypes.INSERT }
  );
};

exports.deleteItem = data => {
  console.log("DELeting!!");
  console.log("data.id = ", data.id);
  return sequelize.query(
    "DELETE FROM items" +
    " WHERE itemid = $1",
    { bind: [data.deleteId], type: sequelize.QueryTypes.DELETE }
  );
};

exports.getOrders = (fbid, today) => {
  return sequelize.query(
    "SELECT * FROM orders" +
    " INNER JOIN sizes ON orders.sizeid = sizes.sizeid" +
    " INNER JOIN types ON orders.typeid = types.typeid" +
    " INNER JOIN items ON types.itemid = items.itemid" +
    " WHERE orders.fbid = :fbid AND pickuptime >= :today" +
    " ORDER BY orders.pickuptime ASC",
    { replacements: {fbid, today}, type: sequelize.QueryTypes.SELECT }
  );
};

exports.orderComplete = orderid => {
  return sequelize.query(
    "UPDATE orders" +
    " SET pending = NOT pending" +
    " WHERE orderid = $1",
    { bind: [orderid], type: sequelize.QueryTypes.UPDATE }
  );
};

exports.linkCompany = (id, facebookId) => {
  return User.findOne({
    attributes: ['accounts'],
    where: { id }
  })
    .then(val => {
      const page = val.accounts.filter(v => v.fbid == facebookId);
      return sequelize.query(
        "INSERT INTO companies (fbid, name)" +
        " VALUES (:fbid, :name)" +
        " RETURNING fbid",
        { replacements: { fbid: page[0].fbid, name: page[0].name }, type: sequelize.QueryTypes.INSERT }
      );
    });
};
