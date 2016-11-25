/**
 * Created by lewis.knoxstreader on 20/11/16.
 */
const { client, pub, sub } = require('./redis-init'),
  { fetchOrders, setOrderComplete } = require('./controllers/orders');

function requestOrders (io) {
  io.on('connection', function (socket) {
    console.log("     socket.io connection!");

    socket.on('request-orders', function (fbid) {
      sub.subscribe(fbid);

      return fetchOrders(fbid)
        .then(orders => {
          console.log("orders to return", orders);
          return socket.emit('orders-list', orders)
        })
        .catch(err => console.error("error in socket business", err));
    });

  });
}

function newOrder (io) {
  io.on('connection', function (socket) {
    console.log(" updateOrders connection");

    sub.on('message', (channel, message) => {
      console.log("redis channel =", channel);
      return socket.emit('new-order', message)
    });

  });
}

function orderStatus (io) {
  io.on('connection', function (socket) {

    socket.on('order-status', function (orderid) {
      console.log("setting order status");
      return setOrderComplete(orderid);
    })

  });
}

module.exports = {
  requestOrders,
  newOrder,
  orderStatus
};
