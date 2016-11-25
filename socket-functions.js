/**
 * Created by lewis.knoxstreader on 20/11/16.
 */
const { client, pub, sub } = require('./redis-init'),
  { fetchOrders } = require('./controllers/orders');

function requestOrders (io) {
  io.on('connection', function (socket) {
    console.log("     socket.io connection!");

    socket.on('request-orders', function (fbid) {
      sub.subscribe(fbid);

      client.setAsync(fbid, socket.id)
        .then(data => console.log(`set ${fbid} to socket id: ${data}`))
        .then(() => client.getAsync(fbid))
        .then(data => console.log(`retrieved ${data} from redis`))
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

function newOrder (io) {
  io.on('connection', function (socket) {
    console.log(" updateOrders connection");

    sub.on('message', (channel, message) => {
      console.log("redis channel =", channel);
      return socket.emit('new-order', message)
    });

  });
}

module.exports = {
  requestOrders,
  newOrder
};
