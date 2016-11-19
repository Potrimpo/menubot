const chrono = require('chrono-node'),
  { sessions } = require('./../messengerSessions'),
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
  orderTime({context, fbPageId, fbUserId }, request) {
    return new Promise((res, rej) => {
      context = context ? context : {};
      const time = chrono.parseDate(request);
      if(time) {
        const order = sessions[fbUserId].order;
        // fbUserId becomes customer_id
        return db.makeOrder(fbPageId, fbUserId, time, order)
          .then(data => {
            if (data) {
              if (context.noLuck) delete context.noLuck;
              context.pickupTime = String(chrono.parseDate(String(data.pickuptime)));
              return db.orderDetails(data.orderid);
            }
            else {
              context.noLuck = true;
              if (context.pickupTime) delete context.pickupTime;
              if (context.item) delete context.item;
              return res(context);
            }
          })
          .then(function (data) {
            delete context.order;
            Object.assign(context, data[0]);
            return res(context);
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
