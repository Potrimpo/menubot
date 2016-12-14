/**
 * Created by lewis.knoxstreader on 20/11/16.
 */
const { client, sub } = require('./redis-init'),
  { fetchOrders, setOrderComplete } = require('./controllers/orders');

function init (io) {
  io.on('connection', function (socket) {
    console.log("     socket.io connection!");

    socket.on('request-orders', requestOrders);

    sub.on('message', (channel, message) => socket.emit('new-order', message));

    socket.on('order-status', ids => setOrderComplete(JSON.parse(ids)));

    socket.on("disconnect", disco);
  });

}

// --> Register interest in new orders for our page
// create redis entry for our fbid, indexed by the socket id
// subscribe to redis events on our fbid's frequency
function requestOrders (fbid) {
  console.log("subscribing");
  client.setAsync(this.id, fbid)
    .then(() => sub.subscribe(fbid))
    .catch(err => {
      console.error("error setting redis socket session", err);
      return sub.unsubscribe(fbid);
    });

  return fetchOrders(fbid)
    .then(orders => this.emit('orders-list', orders))
    .catch(err => console.error("error in socket business", err));
}

// --> Disconnect socket & stop listening for new-order updates for our page
// find the right fbid by searching redis with our socket id
// unsubscribe from events on fbid frequency
function disco () {
  client.getAsync(this.id)
    .then(fbid => sub.unsubscribe(fbid))
    .then(() => client.delAsync(this.id))
    .catch(err => console.error("error disconnecting socket", err));
}

module.exports = init;
