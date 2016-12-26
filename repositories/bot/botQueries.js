/**
 * Created by lewis.knoxstreader on 21/10/16.
 */
const { Company, Item, Type, Size, Order, Customer, sequelize } = require('./../../database/models/index'),
  fetch = require('node-fetch');

exports.findOrCreateCustomer = (fbUserId, fbPageId, pageToken) =>
  Customer.findById(fbUserId)
    .then(user => {
      if (user) {
        return user;
      }
      return customerDetails(fbUserId, pageToken)
        .then(data =>
          Customer.create({
            customer_id: fbUserId,
            profile_pic: data.profile_pic,
            customer_name: data.first_name + " " + data.last_name
          }));
    });

// fetches customer data from facebook
function customerDetails (fbUserId, pageToken) {
  pageToken = encodeURIComponent(pageToken);
  const url = `https://graph.facebook.com/${fbUserId}?access_token=${pageToken}`;
  return fetch(url, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      return json;
    })
    .catch(err => console.error("error fetching customer data", err));
}

exports.checkOpenStatus = fbid =>
  Company.findOne({
    attributes: ['status', 'opentime', 'closetime', 'delay', 'timezone'],
    where: { fbid }
  });

exports.findLocation = fbid =>
  Company.findOne({
      attributes: ['location'],
      where: { fbid }
    });

exports.findItem = (fbid, item) =>
  Item.findOne({
    attributes: ['item', 'itemid'],
    where: { fbid, item }
  });

exports.getMenu = fbid =>
  Item.findAll({
    attributes: ['item', 'itemid', 'item_photo', 'item_price'],
    where: { fbid }
  });


exports.getTypes = itemid =>
  Type.findAll({
    attributes: ['itemid', 'typeid', 'type', 'type_photo', 'type_price'],
    where: { itemid }
  });

exports.getSizes = typeid =>
  Size.findAll({
    attributes: ['typeid', 'sizeid', 'size', 'size_price'],
    where: { typeid, size_price: { $ne: null } }
  });

exports.orderDetails = orderid =>
  sequelize.query(
    "SELECT * FROM orders AS o" +
    " LEFT OUTER JOIN sizes ON o.sizeid=sizes.sizeid" +
    " LEFT OUTER JOIN types ON o.typeid=types.typeid" +
    " LEFT OUTER JOIN items ON o.itemid=items.itemid" +
    " WHERE o.orderid = :orderid",
    { replacements: { orderid }, type: sequelize.QueryTypes.SELECT }
  );

exports.makeOrder = (fbid, customer_id, pickuptime, { itemid, typeid, sizeid }) =>
  sequelize.transaction(t =>
    Order.create({
      fbid, customer_id, pickuptime,
      itemid, typeid, sizeid
    }, { transaction: t })
      .then(order =>
        sequelize.query(
          "SELECT * FROM orders AS o" +
          " INNER JOIN customers AS c ON o.customer_id = c.customer_id" +
          " LEFT OUTER JOIN sizes AS s ON o.sizeid = s.sizeid" +
          " LEFT OUTER JOIN types AS t ON o.typeid = t.typeid" +
          " LEFT OUTER JOIN items AS i ON o.itemid = i.itemid" +
          " WHERE o.orderid = :orderid" +
          " ORDER BY o.pickuptime ASC",
          {
            replacements: { orderid: order.orderid },
            type: sequelize.QueryTypes.SELECT,
            transaction: t
          })));

exports.ordersbyUserid = customer_id =>
  sequelize.query(
    "SELECT * FROM orders AS o" +
    " LEFT OUTER JOIN sizes ON o.sizeid = sizes.sizeid" +
    " LEFT OUTER JOIN types ON o.typeid = types.typeid" +
    " LEFT OUTER JOIN items ON o.itemid = items.itemid" +
    " WHERE o.customer_id = :customer_id AND pending = true" +
    " ORDER BY o.pickuptime ASC",
    { replacements: { customer_id }, type: sequelize.QueryTypes.SELECT }
  );

// only used in tests
exports.findOrder = (fbid, userid, sizeid) => {
  return Order.findOne({
    attributes: ['orderid', 'pickuptime', 'pending'],
    where: {fbid, customer_id, sizeid}
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
