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

exports.getCompanyMenu = id =>
  sequelize.query(
    "SELECT c.name, c.bot_status, c.location, c.opentime, c.closetime, c.status, i.*" +
    " FROM companies AS c" +
    " INNER JOIN items AS i ON c.fbid = i.fbid" +
    " WHERE c.fbid = $1" +
    " ORDER BY i.itemid ASC",
    { bind: [id], type: sequelize.QueryTypes.SELECT }
  );

exports.getMenuTypes = itemids =>
  sequelize.query(
    "SELECT t.itemid, t.type, t.typeid, t.type_photo, t.type_price FROM types AS t" +
    " WHERE t.itemid IN (:itemids)" +
    " ORDER BY typeid ASC",
    { replacements: { itemids }, type: sequelize.QueryTypes.SELECT }
  );

exports.getMenuSizes = typeids =>
  sequelize.query(
    "SELECT typeid, size, sizeid, size_price FROM sizes" +
    " WHERE typeid IN (:typeids)" +
    " ORDER BY sizeid ASC",
    { replacements: { typeids }, type: sequelize.QueryTypes.SELECT }
  );

exports.getTypesThroughFbid = fbid =>
  sequelize.query(
    "SELECT typeid, type FROM items AS i" +
    " INNER JOIN types AS t ON i.itemid = t.itemid" +
    " WHERE i.fbid = :fbid",
    { replacements: { fbid }, type: sequelize.QueryTypes.SELECT }
  );

exports.insertItem = (fbid, item) =>
  Item.create({ fbid, item })
    .catch(err => console.error("error inserting menu item:", err));

exports.insertType = (type, itemid) =>
  sequelize.transaction(t  =>
    Type.create({ itemid, type }, { transaction: t })
      .then(() =>
        Item.update({
          item_price: null
        }, {
          where: { itemid },
          transaction: t
        })
      )
  )
    .catch(err => console.error("error in insertType transaction", err));

exports.insertSize = (size, typeid) =>
  sequelize.transaction(t  =>
    Size.create({ typeid, size }, { transaction: t })
      .then(() =>
        Type.update({
          type_price: null
        }, {
          where: { typeid },
          transaction: t
        })
      )
  )
    .catch(err => console.error("error in insertSize transaction", err));

exports.updateIPrice = (itemid, item_price) =>
  Item.update({ item_price }, { where: { itemid } });

exports.updateTPrice = (typeid, type_price) =>
  Type.update({ type_price }, { where: { typeid } });

exports.updateSPrice = (sizeid, size_price) =>
  Size.update({ size_price }, { where: { sizeid } });

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

exports.ordersByFbid = (fbid, today) =>
  sequelize.query(
    "SELECT * FROM orders AS o" +
    " INNER JOIN customers AS c ON o.customer_id = c.customer_id" +
    " LEFT OUTER JOIN items AS i ON o.itemid = i.itemid" +
    " LEFT OUTER JOIN types AS t ON o.typeid = t.typeid" +
    " LEFT OUTER JOIN sizes AS s ON o.sizeid = s.sizeid" +
    " WHERE o.fbid = :fbid AND o.pickuptime >= :today" +
    " ORDER BY o.pickuptime ASC",
    { replacements: {fbid, today}, type: sequelize.QueryTypes.SELECT }
  ).catch(err => console.error("error getting orders in sql", err));

exports.orderComplete = orderid =>
  sequelize.query(
    "UPDATE orders" +
    " SET pending = NOT pending" +
    " WHERE orderid = $1",
    { bind: [orderid], type: sequelize.QueryTypes.UPDATE }
  );

exports.linkCompany = (id, facebookId) =>
  User.findOne({
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

exports.getCompanyAccessToken = id =>
  Company.findById(id, {
    attributes: ['access_token']
  });

exports.setBotStatus = (id, status) =>
  sequelize.query(
    "UPDATE companies SET bot_status = :status WHERE fbid = :id",
    { replacements: { id, status}, type: sequelize.QueryTypes.UPDATE}
  );

exports.setLocation = (id, loc) =>
  sequelize.query(
    "UPDATE companies SET location = :loc WHERE fbid = :id",
    { replacements: { id, loc }, type: sequelize.QueryTypes.UPDATE }
  );

exports.addItemPhotos = (val, fbid) =>
  sequelize.query(
    "UPDATE items" +
    " SET item_photo = :picture" +
    " WHERE fbid = :fbid AND lower(item) = lower(:name)",
    { replacements: { fbid, picture: val.picture, name: val.name }, type: sequelize.QueryTypes.UPDATE }
  );

exports.setOpenHours = ({ fbid, opentime, closetime, status }) =>
  Company.update({
    opentime,
    closetime,
    status,
  }, {
    where: { fbid }
  });

exports.addTypePhotos = val =>
  sequelize.query(
    "UPDATE types" +
    " SET type_photo = :picture" +
    " WHERE typeid = :typeid AND lower(type) = lower(:name)",
    { replacements: { typeid: val.typeid, picture: val.picture, name: val.name }, type: sequelize.QueryTypes.UPDATE }
  );
