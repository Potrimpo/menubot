/**
 * Created by lewis.knoxstreader on 20/11/16.
 */

const { client, sub } = require('./redis-init'),
  control = require('./controllers/orders');

function init (io) {
  io.on('connection', function (socket) {
    console.log("     socket.io connection!");

    socket.on('request-orders', requestOrders);

    sub.on('message', (channel, message) => socket.emit('new-order', message));

    socket.on('set-delay', setDelay);

    socket.on('order-status', ids => control.setOrderComplete(JSON.parse(ids)));

    socket.on("disconnect", disco);
  });

}

// :: socket -> Promise
const getFbid = socket => client.getAsync(socket.id);

function setDelay (time) {
  return getFbid(this)
    .then(fbid => control.setDelay(fbid, time));
}

// --> Register interest in new orders for our page
// create redis entry for our fbid, indexed by the socket id
// subscribe to redis events on our fbid's frequency
function requestOrders (fbid) {
  client.setAsync(this.id, fbid)
    .then(() => sub.subscribe(fbid))
    .catch(_ => sub.unsubscribe(fbid));

  return control.fetchOrders(fbid)
    .then(orders => this.emit('orders-list', orders))
    .catch(err => console.error("error in socket business", err));
}

// --> Disconnect socket & stop listening for new-order updates for our page
// find the right fbid by searching redis with our socket id
// unsubscribe from redis messages on fbid frequency
function disco () {
  return getFbid(this)
    .then(fbid => sub.unsubscribe(fbid))
    .then(() => client.delAsync(this.id))
    .catch(err => console.error("error disconnecting socket", err));
}

module.exports = init;
