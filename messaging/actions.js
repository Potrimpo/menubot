const chrono = require('chrono-node'),
  { sessions } = require('./../witSessions'),
  fbMessage = require('./messenger'),
  // { findItem, makeOrder, orderDetails } = require('./../sql'),
  db = require('../repositories/bot/botQueries');

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
      message.quick_replies = message.quickreplies.map(x => {
        return {"title": x, "content_type": "text", "payload": x.toUpperCase()};
      });
      delete message.quickreplies;
    }
    // retrieve the Facebook user whose session belongs to
    const recipientId = sessions[sessionId].fbUserId;
    const token = sessions[sessionId].access_token;
    if (recipientId) {
      console.log("order be4 sending =", sessions[sessionId].order);
      console.log("ALL SESSIONS: actions.send ===", sessions);
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

  // check if item x is in database
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
  orderTime({context, fbPageId, fbUserId }, request) {
    return new Promise((res, rej) => {
      console.log("request ==", request);
      const time = chrono.parseDate(request);
      if(time) {
        console.log("order time =", time);
        const order = sessions[fbUserId].order;
        console.log("order in orderTime =", order);
        return db.makeOrder(fbPageId, fbUserId, order.sizeid, time)
          .then(data => {
            if (data) {
              delete context.noLuck;
              context.pickupTime = String(chrono.parseDate(String(data.pickuptime)));
              return db.orderDetails(order.sizeid);
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
