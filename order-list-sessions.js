/**
 * Created by lewis.knoxstreader on 20/11/16.
 */
const { fetchOrders } = require('./controllers/orders');

exports.initSocket = function (fbid) {
  client.setAsync(fbid, socket.id)
    .catch(err => console.error("error setting redis socket session", err));

  return fetchOrders(fbid)
    .then(orders => socket.emit('orders-list', orders))
    .catch(err => console.error("error in socket business", err));
};

exports.newOrder = (io, client, order) => {
  console.log(" a new order is happen");
  console.log(order.dataValues);
  return client.getAsync(order.fbid)
    .then(id => {
      return io.to(id).emit('new-order', order.dataValues)
    })
    .catch(err => console.error("error emitting new order event"), err);
};
