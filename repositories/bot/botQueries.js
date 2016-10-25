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
    attributes: ['item', 'itemid', 'photo'],
    where: { fbid }
  })
};


exports.getTypes = itemid => {
  return Type.findAll({
    attributes: ['itemid', 'typeid', 'type', 'photo'],
    where: { itemid }
  })
};

exports.getSizes = typeid => {
  return Size.findAll({
    attributes: ['typeid', 'sizeid', 'size', 'price'],
    where: { typeid }
  })
  };

exports.orderDetails = sizeid => {
  return sequelize.query(
    "SELECT sizes.sizeid, sizes.typeid, types.itemid, sizes.size, type, item" +
    " FROM sizes INNER JOIN types ON sizes.typeid=types.typeid" +
    " INNER JOIN items ON types.itemid=items.itemid" +
    " WHERE sizes.sizeid=$1",
    { bind: [sizeid], type: sequelize.QueryTypes.SELECT }
  );
};

exports.makeOrder = (fbid, userid, sizeid, pickuptime)  => {
  console.log("makeOrder pickuptime =", pickuptime);
  return Order.build({
    fbid, userid, sizeid, pickuptime
  })
  .save();
};

exports.ordersbyUserid = userid => {
  return sequelize.query(
    "SELECT * FROM orders" +
    " INNER JOIN sizes ON orders.sizeid = sizes.sizeid" +
    " INNER JOIN types ON sizes.typeid = types.typeid" +
    " INNER JOIN items ON types.itemid = items.itemid" +
    " WHERE orders.userid = :userid AND pending = true" +
    " ORDER BY orders.pickuptime ASC",
    { replacements: { userid }, type: sequelize.QueryTypes.SELECT }
  );
};

// only used in tests
exports.findOrder = (fbid, userid, sizeid) => {
  return Order.findOne({
    attributes: ['pickuptime'],
    where: {fbid, userid, sizeid}
  })
  .catch(err => console.error("error in Order.findOrder:", err.message || err));
};
