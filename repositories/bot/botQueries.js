/**
 * Created by lewis.knoxstreader on 21/10/16.
 */
const { Company, Item, Type, Size, Order, Customer, sequelize } = require('./../../database/models/index'),
  fetch = require('node-fetch');

exports.findOrCreateCustomer = (fbUserId, fbPageId, pageToken) => {
  return Customer.findById(fbUserId)
    .then(user => {
      if (user) {
        return user;
      }
      return customerDetails(fbUserId, pageToken)
        .then(data => {
          console.log("data from customer fb request", data);
          return Customer.build({
            customer_id: fbUserId,
            photo: data.profile_pic,
            name: data.first_name + " " + data.last_name
          }).save();
        })
    })
};

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
      console.log("JSON ====", json);
      return json;
    })
    .catch(err => console.error("error fetching customer data", err));
}

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

exports.makeOrder = (fbid, customer_id, pickuptime, { itemid, typeid, sizeid })  => {
  console.log("makeOrder pickuptime =", pickuptime);
  return Order.build({
    fbid, customer_id, pickuptime, itemid, typeid, sizeid
  })
  .save();
};

exports.ordersbyUserid = customer_id => {
  return sequelize.query(
    "SELECT * FROM orders AS o" +
    " LEFT OUTER JOIN sizes ON o.sizeid = sizes.sizeid" +
    " LEFT OUTER JOIN types ON o.typeid = types.typeid" +
    " LEFT OUTER JOIN items ON o.itemid = items.itemid" +
    " WHERE o.customer_id = :customer_id AND pending = true" +
    " ORDER BY o.pickuptime ASC",
    { replacements: { customer_id }, type: sequelize.QueryTypes.SELECT }
  );
};

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
