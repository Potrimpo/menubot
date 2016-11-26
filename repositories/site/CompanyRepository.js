/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const { sequelize, Company, User, Item, Type, Size, Order } = require('../../database/models/index');

exports.findUserCompanies = accounts => {
  return Company.findAll({
    attributes: ['fbid', 'name', 'bot_status'],
    where: {fbid: {$or: accounts}}
  });
};

exports.findCompany = (id) => Company.findById(id);

exports.getCompanyMenu = id => {
  return sequelize.query(
    "SELECT c.name, c.bot_status, c.location, i.* FROM companies AS c" +
    " INNER JOIN items AS i ON c.fbid = i.fbid" +
    " WHERE c.fbid = $1" +
    " ORDER BY itemid ASC",
    { bind: [id], type: sequelize.QueryTypes.SELECT }
  );
};

exports.getMenuTypes = itemids => {
  return sequelize.query(
    "SELECT types.itemid, type, typeid, types.type_photo, types.type_price FROM items" +
    " INNER JOIN types ON items.itemid = types.itemid" +
    " WHERE items.itemid IN (:itemids)" +
    " ORDER BY typeid ASC",
    { replacements: { itemids }, type: sequelize.QueryTypes.SELECT }
  );
};

exports.getMenuSizes = typeids => {
  return sequelize.query(
    "SELECT sizes.typeid, size, sizeid, sizes.size_price FROM types" +
    " INNER JOIN sizes ON types.typeid = sizes.typeid" +
    " WHERE types.typeid IN (:typeids)" +
    " ORDER BY sizeid ASC",
    { replacements: { typeids }, type: sequelize.QueryTypes.SELECT }
  );
};

exports.getTypesThroughFbid = fbid => {
  return sequelize.query(
    "SELECT typeid, type FROM items" +
    " INNER JOIN types ON items.itemid = types.itemid" +
    " WHERE items.fbid = :fbid",
    { replacements: { fbid }, type: sequelize.QueryTypes.SELECT }
  );
};

exports.insertItem = (fbid, item) => {
  return Item.create({ fbid, item })
    .catch(err => console.error("error inserting menu item:", err));
};

exports.insertType = (type, itemid) => {
  return sequelize.transaction(function (t) {

    return Type.create({ itemid, type }, { transaction: t })
      .then(() => {
        return Item.update({
          item_price: null
        }, {
          where: { itemid },
          transaction: t
        });
    })

  }).catch(err => console.error("error in insertType transaction", err));
};

exports.insertSize = data => {
  return sequelize.query(
    "INSERT INTO sizes (typeid, size)" +
    " VALUES (:typeid, :size)",
    { replacements: { typeid: data.parentId, size: data.size}, type: sequelize.QueryTypes.INSERT }
  );
};

exports.deleteTypePrice = data => {
  return sequelize.query(
    "UPDATE types" +
    " SET type_price = null" +
    " WHERE typeid = :typeid",
    { replacements: { typeid: data.parentId }, type: sequelize.QueryTypes.UPDATE }
  );
};

exports.updateIPrice = data => {
  return sequelize.query(
    "UPDATE ONLY items" +
    " SET item_price = :price" +
    " WHERE itemid = :itemid",
    { replacements: { itemid: data.parentId, price: data.price}, type: sequelize.QueryTypes.UPDATE }
  );
};

exports.updateTPrice = data => {
  return sequelize.query(
    "UPDATE ONLY types" +
    " SET type_price = :price" +
    " WHERE typeid = :typeid",
    { replacements: { typeid: data.parentId, price: data.price}, type: sequelize.QueryTypes.UPDATE }
  );
};

exports.updateSPrice = data => {
  return sequelize.query(
    "UPDATE ONLY sizes" +
    " SET size_price = :price" +
    " WHERE sizeid = :sizeid",
    { replacements: { sizeid: data.parentId, price: data.price}, type: sequelize.QueryTypes.UPDATE }
  );
};

exports.deleteItem = data => {
  switch (data.type) {

    case "item":
    console.log("Deleting item: " + data.id );
    return sequelize.query(
      "DELETE FROM items" +
      " WHERE itemid = $1",
      { bind: [data.deleteId], type: sequelize.QueryTypes.DELETE }
    );
      break;


    case "type":
    console.log("Deleting type: " + data.id );
    return sequelize.query(
      "DELETE FROM types" +
      " WHERE typeid = $1",
      { bind: [data.deleteId], type: sequelize.QueryTypes.DELETE }
    );
      break;


    case "size":
    console.log("Deleting size: " + data.id );
    return sequelize.query(
      "DELETE FROM sizes" +
      " WHERE sizeid = $1",
      { bind: [data.deleteId], type: sequelize.QueryTypes.DELETE }
    );
      break;


    default:
      console.log("Attempt to delete failed, type not recognised");
  }

};

exports.ordersByFbid = (fbid, today) => {
  return sequelize.query(
    "SELECT * FROM orders AS o" +
    " INNER JOIN customers ON o.customer_id = customers.customer_id" +
    " LEFT OUTER JOIN items ON o.itemid = items.itemid" +
    " LEFT OUTER JOIN types ON o.typeid = types.typeid" +
    " LEFT OUTER JOIN sizes ON o.sizeid = sizes.sizeid" +
    " WHERE o.fbid = :fbid AND o.pickuptime >= :today" +
    " ORDER BY o.pickuptime ASC",
    { replacements: {fbid, today}, type: sequelize.QueryTypes.SELECT }
  ).catch(err => console.error("error getting orders in sql", err));
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
        "INSERT INTO companies (fbid, name, access_token)" +
        " VALUES (:fbid, :name, :access_token)" +
        " RETURNING fbid",
        { replacements: { fbid: page[0].fbid, name: page[0].name, access_token: page[0].access_token },
          type: sequelize.QueryTypes.INSERT }
      );
    });
};

exports.getCompanyAccessToken = id => Company.findById(id, { attributes: ['access_token']});

exports.setBotStatus = (id, status) => sequelize.query(
  "UPDATE companies SET bot_status = :status WHERE fbid = :id",
  { replacements: { id, status}, type: sequelize.QueryTypes.UPDATE}
);

exports.setLocation = (id, loc) => sequelize.query(
  "UPDATE companies SET location = :loc WHERE fbid = :id",
  { replacements: { id, loc }, type: sequelize.QueryTypes.UPDATE }
);

exports.addItemPhotos = (val, fbid) => {
  if (val.picture && val.name) {
    return sequelize.query(
      "UPDATE items" +
      " SET item_photo = :picture" +
      " WHERE fbid = :fbid AND lower(item) = lower(:name)" +
      " RETURNING item, itemid",
      { replacements: { fbid, picture: val.picture, name: val.name }, type: sequelize.QueryTypes.UPDATE }
    );
  }
  else throw 'fields missing in database update db';
};

exports.addTypePhotos = val => {
  if (val.picture && val.name && val.typeid) {
    return sequelize.query(
      "UPDATE types" +
      " SET type_photo = :picture" +
      " WHERE typeid = :typeid AND lower(type) = lower(:name)",
      { replacements: { typeid: val.typeid, picture: val.picture, name: val.name }, type: sequelize.QueryTypes.UPDATE }
    );
  }
  else throw 'fields missing in database update db';
};
