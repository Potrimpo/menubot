const fbMessage = require('./../fbMessage'),
  { redisRetrieveOrder, redisGetToken } = require('./../../state-and-sessions/messengerSessions'),
  text = require('../text-messages'),
  Order = require('../../classes/Order');

// Our bot actions
const actions = {
  send(fbUserId, message) {
    if (message.text) console.log(`replying >> ${message.text}`);
    // get the access token for this user's interaction (page access token for messenger)
    return redisGetToken(fbUserId)
      .then(token =>
        fbMessage(fbUserId, token, message)
          .then(() => null)
          .catch((err) => {
            console.error(
              'Oops! An error occurred while forwarding the response to',
              fbUserId,
              ':',
              err.stack || err
            );
            console.log(`was trying to send: ${message.text}`);
          }));
  },

  // specify the time of an order
  orderTime(fbUserId, fbPageId, requestedPickup, timestamp) {
    return redisRetrieveOrder(fbUserId)
      .then(data => {
        if (!data.itemid) throw "No order for this user in Redis";
        return new Order(fbPageId, fbUserId, requestedPickup, timestamp, data);
      })
      .then(order => order ? order : new Error("couldn't create order instance"))
      .catch(err => console.error("Error in orderTime", err));
  },

  defaultResp () {
    return new Promise(res => res(text.defaultResponse));
  }
};

module.exports = actions;
