/**
 * Created by lewis.knoxstreader on 31/08/16.
 */

const chrono = require('chrono-node'),
  { redisRecordOrder } = require('./messengerSessions'),
  structured = require('./structured-messages'),
  db = require('./../repositories/bot/botQueries');

function postbackHandler (payload, fbUserId, fbPageId) {
  return new Promise(function (res, rej) {
    payload = JSON.parse(payload);

    switch (payload.intent) {
      case 'MENU':
        return db.getMenu(fbPageId)
          .then((menu) => res(structured.parseItems(menu)) )
          .catch(err => console.error(`Error in postback:`, err));

      case 'LOCATION':
        return db.findLocation(fbPageId)
          .then(data => res(data.location ? data.location : "Sorry, I don't know where I am!"))
          .catch(err => console.error(`Error in postback:`, err));

      case 'DETAILS':
        return db.getTypes(payload.itemid)
          .then(types => res(structured.parseProductTypes(types, payload.itemid)) )
          .catch(err => console.error(`Error in postback:`, err));

      case 'SIZES':
        return db.getSizes(payload.typeid)
          .then(sizes => res(structured.parseProductSizes(sizes, payload.typeid, payload.itemid)) )
          .catch(err => console.error(`Error in postback:`, err));

      case 'ORDER':
        return db.checkOpenStatus(fbPageId)
          .then(status => openStatus(status, fbUserId, payload))
          .then(resp => res(resp))
          .catch(err => console.error("error checking company status", err));

      case 'MY_ORDERS':
        return db.ordersbyUserid(fbUserId)
          .then(orders => res(structured.parseOrders(orders)))
          .catch(err => console.error(`Error in postback`, err));

      case 'GET_STARTED':
       return res(structured.getStarted());

      default:
        return rej(new Error("couldn't deal with this postbackHandler input"));
    }

  });
}

function openStatus (data, fbUserId, payload) {
  console.log("company status =", data.status);
  switch (data.status) {
    case true:
      return filterHours({
        opentime: data.opentime,
        closetime: data.closetime
      }, payload, fbUserId);

    case false:
      return "Sorry! We're not open today!";
  }
}

function filterHours (hours, payload, fbUserId) {
  const now = Date.now();
  if (now > chrono.parseDate(hours.closetime)) {
    return `Sorry! We're only open between ${hours.opentime} and ${hours.closetime} today!`;
  }
  else {
    return redisRecordOrder(fbUserId, payload)
      .then(() => "What time would you like that? (include am/pm)");
  }
}

module.exports = postbackHandler;
