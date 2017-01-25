const commands = require('../bot-commands'),
  structured = require('./../structured-messages');

// JSON -> {} -> Number -> Promise
const postbackHandler = (jsonPayload, ids, timestamp) => {
  const payload = JSON.parse(jsonPayload);
  return intentSwitch(payload, ids, timestamp);
};

// {} -> {} -> Number -> Promise
const intentSwitch = (payload, ids, timestamp) => {
  switch (payload.intent.toUpperCase()) {
    case 'MENU':
      return commands.getMenu(ids.pageId);

    case 'LOCATION':
      return commands.getLocation(ids.pageId);

    case 'DETAILS':
      return commands.getTypes(payload.itemid);

    case 'SIZES':
      return commands.getSizes(payload.typeid, payload.itemid);

    case 'ORDER':
      return commands.placeOrder(ids.pageId, ids.userId, payload, timestamp);

    case 'QUANTITY':
      return commands.setQuantity(ids.pageId, ids.userId, payload);

    case 'MY_ORDERS':
      return commands.myOrders(ids.userId);

    case 'HOURS':
      return commands.getHours(ids.pageId);

    case 'GET_STARTED':
      return new Promise(res => res(structured.getStarted()));

    default:
      return new Promise((_, rej) => rej(new Error("couldn't deal with this postbackHandler input")));
  }
};

module.exports = postbackHandler;
