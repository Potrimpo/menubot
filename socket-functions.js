/**
 * Created by lewis.knoxstreader on 20/11/16.
 */
const { sub } = require('./redis-init'),
  { fetchOrders, setOrderComplete } = require('./controllers/orders');

function init (io) {
  io.on('connection', function (socket) {
    console.log("     socket.io connection!");

    socket.on('request-orders', requestOrders);

    sub.on('message', (channel, message) => socket.emit('new-order', message));

    socket.on('order-status', orderid => setOrderComplete(orderid));

  });
}

function requestOrders (fbid) {
  sub.subscribe(fbid);

  return fetchOrders(fbid)
    .then(orders => this.emit('orders-list', orders))
    .catch(err => console.error("error in socket business", err));
}

module.exports = init;
