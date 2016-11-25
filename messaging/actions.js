const chrono = require('chrono-node'),
  { redisRetrieveOrder, redisGetToken } = require('./messengerSessions'),
  fbMessage = require('./fbMessage'),
  Order = require('../classes/Order'),
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
      const time = chrono.parseDate(request);
      if(time) {
        return redisRetrieveOrder(fbUserId)
          .then(data => {
            if (!data.itemid) throw "No order for this user in Redis";
            console.log("order from redis!", data);
            return db.makeOrder(fbPageId, fbUserId, time, data)
          })
          .then(data => {
            const order = new Order(data[0]);

            // should return array of length 1
            if (data && data.length == 1) return res(order);
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
