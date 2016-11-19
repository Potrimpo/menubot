const chrono = require('chrono-node'),
  { sessions, retrieveOrder } = require('./../messengerSessions'),
  fbMessage = require('./messenger'),
  db = require('../repositories/bot/botQueries');

// Our bot actions
const actions = {
  send({sessionId}, message) {
    if (message.text) { console.log(`replying >> ${message.text}`); }
    if (message.quickreplies) {
      message.quick_replies = message.quickreplies.map(x => {
        return {"title": x, "content_type": "text", "payload": x.toUpperCase()};
      });
      delete message.quickreplies;
    }
    // retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbUserId;
    const token = sessions[sessionId].access_token;
    if (recipientId) {
      return fbMessage(recipientId, token, message)
        .then(() => null)
        .catch((err) => {
          console.error(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err.stack || err
          );
          console.log(`was trying to send: ${text}`);
        });
    } else {
      console.error('Oops! Couldn\'t find user for session:', sessionId);
      // Giving the wheel back to our bot
      return Promise.resolve()
    }
  },

  // [ NO LONGER USED] check if item x is in database
  checkProduct({context, entities, fbPageId }) {
    const prod = firstEntityValue(entities, 'product');
    return new Promise((res, rej) => {
      if(prod) {
        return db.findItem(fbPageId, prod)
          .then(data => {
            if (data) {
              context.productInfo = data.item;
              delete context.itemNotFound;
              return res(context);
            }
            else {
              context.itemNotFound = true;
              delete context.productInfo;
              return res(context);
            }
          })
          .catch(err => {
            console.error(err);
            return rej(err);
          });
      }
    });
  },

  // specify the time of an order
  orderTime({fbPageId, fbUserId }, request) {
    return new Promise((res, rej) => {
      const orderInfo = {};
      const time = chrono.parseDate(request);
      if(time) {
        return retrieveOrder(fbUserId)
          .then(data => {
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
