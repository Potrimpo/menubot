/**
 * Created by lewis.knoxstreader on 21/10/16.
 */
const { Company, Item, Type, Size, Order, sequelize } = require('./../../database/models/index');

exports.findLocation = fbid => {
    return Company.findOne({
      attributes: ['location'],
      where: { fbid }
    })
  };

exports.findItem = (fbid, item) => {
  return Item.findOne({
    attributes: ['item', 'itemid'],
    where: { fbid, item }
  })
};

exports.getMenu = fbid => {
  return Item.findAll({
    attributes: ['item', 'itemid', 'photo', 'item_price'],
    where: { fbid }
  })
};


exports.getTypes = itemid => {
  return Type.findAll({
    attributes: ['itemid', 'typeid', 'type', 'photo', 'type_price'],
    where: { itemid }
  })
};

exports.getSizes = typeid => {
  return Size.findAll({
    attributes: ['typeid', 'sizeid', 'size', 'size_price'],
    where: { typeid }
  })
};

exports.orderDetails = orderid => {
  return sequelize.query(
    "SELECT * FROM orders AS o" +
    " LEFT OUTER JOIN sizes ON o.sizeid=sizes.sizeid" +
    " LEFT OUTER JOIN types ON o.typeid=types.typeid" +
    " LEFT OUTER JOIN items ON o.itemid=items.itemid" +
    " WHERE o.orderid = :orderid",
    { replacements: { orderid }, type: sequelize.QueryTypes.SELECT }
  );
};

exports.makeOrder = (fbid, userid, pickuptime, { itemid, typeid, sizeid })  => {
  console.log("makeOrder pickuptime =", pickuptime);
  return Order.build({
    fbid, userid, pickuptime, itemid, typeid, sizeid
  })
  .save();
};

exports.ordersbyUserid = userid => {
  return sequelize.query(
    "SELECT * FROM orders AS o" +
    " LEFT OUTER JOIN sizes ON o.sizeid = sizes.sizeid" +
    " LEFT OUTER JOIN types ON o.typeid = types.typeid" +
    " LEFT OUTER JOIN items ON o.itemid = items.itemid" +
    " WHERE o.userid = :userid AND pending = true" +
    " ORDER BY o.pickuptime ASC",
    { replacements: { userid }, type: sequelize.QueryTypes.SELECT }
  );
};

// only used in tests
exports.findOrder = (fbid, userid, sizeid) => {
  return Order.findOne({
    attributes: ['orderid', 'pickuptime', 'pending'],
    where: {fbid, userid, sizeid}
  })
  .catch(err => console.error("error in Order.findOrder:", err.message || err));
};

exports.findOrderById = orderid => Order.findById(orderid);

exports.deleteOrder = orderid => {
  return sequelize.query(
    "DELETE FROM orders" +
    " WHERE orderid = :orderid",
    { replacements: {orderid}, type: sequelize.QueryTypes.DELETE }
  );
};
