/**
 * Created by lewis.knoxstreader on 31/08/16.
 */

const chrono = require('chrono-node'),
  { redisRecordOrder } = require('./messengerSessions'),
  structured = require('./structured-messages'),
  db = require('./../repositories/bot/botQueries');

function postbackHandler (jsonPayload, fbUserId, fbPageId) {
  return new Promise(function (res, rej) {
    const payload = JSON.parse(jsonPayload);

    switch (payload.intent.toUpperCase()) {
      case 'MENU':
        return db.getMenu(fbPageId)
          .then((menu) => res(structured.parseItems(menu)) )
          .catch(err => rej(err));

      case 'LOCATION':
        return db.findLocation(fbPageId)
          .then(data => res(data.location ? data.location : "Sorry, I don't know where I am!"))
          .catch(err => rej(err));

      case 'DETAILS':
        return db.getTypes(payload.itemid)
          .then(types => res(structured.parseProductTypes(types, payload.itemid)) )
          .catch(err => rej(err));

      case 'SIZES':
        return db.getSizes(payload.typeid)
          .then(sizes => res(structured.parseProductSizes(sizes, payload.typeid, payload.itemid)) )
          .catch(err => rej(err));

      case 'ORDER':
        return db.checkOpenStatus(fbPageId)
          .then(status => openStatus(status, fbUserId, payload))
          .then(resp => res(resp))
          .catch(err => rej(err));

      case 'MY_ORDERS':
        return db.ordersbyUserid(fbUserId)
          .then(orders => res(structured.parseOrders(orders)))
          .catch(err => rej(err));

      case 'HOURS':
        return db.checkOpenStatus(fbPageId)
          .then(hours => res(postbackHours(hours)))
          .catch(err => rej(err));

      case 'GET_STARTED':
       return res(structured.getStarted());

      default:
        return rej(new Error("couldn't deal with this postbackHandler input"));
    }

  })
    .catch(err => {
      const payload = JSON.parse(jsonPayload);
      console.error(`Error in ${payload.intent} postback:`, err)
    });
}

function postbackHours (hours) {
  switch (hours.status) {
    case false:
      return "Sorry! We're not open today";

    case true:
      return `We're open between ${hours.opentime} and ${hours.closetime} today`;
  }
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
