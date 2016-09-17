const chrono = require('chrono-node'),
  { sessions } = require('./../witSessions'),
  fbMessage = require('./messenger'),
  { findItem, makeOrder, orderDetails } = require('./../sql'),
  { Item, Size, Order } = require('./../database');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};


// Our bot actions
const actions = {
  send({sessionId}, message) {
    if (message.text) { console.log(`replying >> ${message.text}`); }
    if (message.quickreplies) {
      message.quick_replies = quickreplies.map(x => {
        return {"title": x, "content_type": "text", "payload": "empty"};
      });
      delete message.quickreplies;
    }
    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbUserId;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      // We return a promise to let our bot know when we're done sending
      return fbMessage(recipientId, message)
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

  // check if item x is in database
  checkProduct({context, entities, fbPageId }) {
    const prod = firstEntityValue(entities, 'product');
    return new Promise((res, rej) => {
      if(prod) {
        return Item.findItem(fbPageId, prod)
          .then(data => {
            if (data) {
              context.productInfo = data.item;
              delete context.itemNotFound;
              console.log('context:', context);
              return res(context);
            }
            else {
              context.itemNotFound = true;
              delete context.productInfo;
              console.log('context:', context);
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
  orderTime({context, entities, fbPageId, fbUserId }) {
    const time = firstEntityValue(entities, 'datetime');
    return new Promise((res, rej) => {
      if(time) {
        console.log("INSERTING INTO DATABASE");
        return Order.makeOrder(fbPageId, fbUserId, context.order.typeid, context.order.sizeid, time)
          .then(data => {
            if (data) {
              delete context.noLuck;
              context.pickupTime = String(chrono.parseDate(String(data.pickuptime)));
              return Size.orderDetails(context.order.sizeid)
            }
            else {
              context.noLuck = true;
              delete context.pickupTime;
              delete context.item;
              return res(context);
            }
          })
          .then(function (data) {
            delete context.order;
            Object.assign(context, data);
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
