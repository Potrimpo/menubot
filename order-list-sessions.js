/**
 * Created by lewis.knoxstreader on 20/11/16.
 */
const redis = require('redis'),
  bluebird = require('bluebird');

const client = redis.createClient(),
  { fetchOrders } = require('./controllers/orders');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let io = require('socket.io');

client.onAsync('connect')
  .then(() => console.log('----> redis connected'));

const initSockets = function (http) {
  io = io(http);
  console.log("   --> in initSockets");

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
};

const newOrder = (io, client, order) => {
  console.log(" a new order is happen");
  console.log(order.dataValues);
  return client.getAsync(order.fbid)
    .then(id => {
      return io.to(id).emit('new-order', order.dataValues)
    })
    .catch(err => console.error("error emitting new order event"), err);
};

module.exports = {
  client,
  io,
  initSockets,
  newOrder
};
