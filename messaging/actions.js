const chrono = require('chrono-node'),
  { pub } = require('../redis-init'),
  { redisRetrieveOrder, redisGetToken } = require('./messengerSessions'),
  fbMessage = require('./fbMessage'),
  db = require('../repositories/bot/botQueries');

// Our bot actions
const actions = {
  send(fbUserId, message) {
    if (message.text) { console.log(`replying >> ${message.text}`); }
    // get the access token for this user's interaction (page access token for messenger)
    return redisGetToken(fbUserId)
      .then(token => {
        return fbMessage(fbUserId, token, message)
          .then(() => null)
          .catch((err) => {
            console.error(
              'Oops! An error occurred while forwarding the response to',
              fbUserId,
              ':',
              err.stack || err
            );
            console.log(`was trying to send: ${text}`);
          });
      })
  },

  // specify the time of an order
  orderTime(fbUserId, fbPageId, request) {
    return new Promise((res, rej) => {
      const orderInfo = {};
      const time = chrono.parseDate(request);
      if(time) {
        return redisRetrieveOrder(fbUserId)
          .then(data => {
            if (!data.itemid) throw "No order for this user in Redis";
            console.log("order from redis!", data);
            return db.makeOrder(fbPageId, fbUserId, time, data)
          })
          .then(order => {
            if (order) {
              orderInfo.pickupTime = String(chrono.parseDate(String(order.pickuptime)));
              return db.orderDetails(order.orderid);
            }
            else {
              orderInfo.noLuck = true;
              if (orderInfo.pickupTime) delete orderInfo.pickupTime;
              if (orderInfo.item) delete orderInfo.item;
              return res(orderInfo);
            }
          })
          .then(function (details) {
            console.log("order details", details);
            // broadcast order details
            pub.publish(fbPageId, JSON.stringify(details));

            delete orderInfo.order;
            Object.assign(orderInfo, details[0]);
            return res(orderInfo);
          })
          .catch(err => {
            console.error("Error in orderTime", err.message || err);
            return rej(err);
          });
      }
    });
  },

};

module.exports = actions;
