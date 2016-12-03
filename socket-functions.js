/**
 * Created by lewis.knoxstreader on 20/11/16.
 */
const Rx = require('rx'),
  { client, sub } = require('./redis-init'),
  { fetchOrders, setOrderComplete } = require('./controllers/orders');

function init (io) {
  io.on('connection', function (socket) {
    console.log("     socket.io connection!");

    socket.on('request-orders', requestOrders);

    // assign to socket object so we can access & dispose of subscription at any point
    socket.orderSubscription = Rx.Observable.create(observer => {
      sub.on('message', (channel, message) => observer.onNext(message));
      sub.on('unsubscribe', channel => observer.onCompleted());
    })
    .debounce(500)
    .subscribe(
      (message) => socket.emit('new-order', message),
      err => console.error("error in this shit", err)
    );

    socket.on('order-status', orderid => setOrderComplete(orderid));

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
// unsubscribe from redis messages on fbid frequency
function disco () {
  return client.getAsync(this.id)
    .then(fbid => sub.unsubscribe(fbid))
    .then(() => client.delAsync(this.id))
    .catch(err => console.error("error disconnecting socket", err));
}

module.exports = init;
