const structured = require('./../structured-messages'),
  text = require('./../text-messages'),
  db = require('./../../repositories/bot/botQueries');

// JSON -> {} -> Number -> Promise
const postbackHandler = (jsonPayload, ids, timestamp) => {
  const payload = JSON.parse(jsonPayload);
  return intentSwitch(payload, ids, timestamp);
};

// {} -> {} -> Number -> Promise
const intentSwitch = (payload, ids, timestamp) => {
  switch (payload.intent.toUpperCase()) {
    case 'MENU':
      return getMenu(ids.pageId);

    case 'LOCATION':
      return getLocation(ids.pageId);

    case 'DETAILS':
      return getTypes(payload.itemid);

    case 'SIZES':
      return getSizes(payload.typeid, payload.itemid);

    case 'ORDER':
      return placeOrder(ids.pageId, ids.userId, payload, timestamp);

    case 'MY_ORDERS':
      return myOrders(ids.userId);

    case 'HOURS':
      return getHours(ids.pageId);

    case 'GET_STARTED':
      return new Promise(res => res(structured.getStarted()));

    default:
      return new Promise((_, rej) => rej(new Error("couldn't deal with this postbackHandler input")));
  }
};

module.exports = postbackHandler;
