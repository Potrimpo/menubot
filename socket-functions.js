/**
 * Created by lewis.knoxstreader on 20/11/16.
 */
const client = require('./redis-init'),
  { fetchOrders } = require('./controllers/orders');

function requestOrders (io) {
  io.on('connection', function (socket) {
    console.log("     socket.io connection!");

    socket.on('request-orders', function (fbid) {
      console.log("REQUESTING ORDERS FOR", fbid);
      client.setAsync(fbid, socket.id)
        .catch(err => console.error("error setting redis socket session", err));

      return fetchOrders(fbid)
        .then(orders => {
          console.log("orders to return", orders);
          return socket.emit('orders-list', orders)
        })
        .catch(err => console.error("error in socket business", err));
    });

  });
}

function newOrder (io, client, order) {
  console.log(" a new order is happen");
  console.log(order.dataValues);
  return client.getAsync(order.fbid)
    .then(id => {
      return io.to(id).emit('new-order', order.dataValues)
    })
    .catch(err => console.error("error emitting new order event"), err);
}

module.exports = {
  requestOrders,
  newOrder
};
