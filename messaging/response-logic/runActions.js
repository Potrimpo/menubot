const actions = require('./actions'),
  chrono = require('chrono-node'),
  time = require('../time-management'),
  text = require('./../text-messages'),
  QR = require('../quick-replies'),
  txt = require('../message-list'),
  structured = require('./../structured-messages'),
  db = require('./../../repositories/bot/botQueries');

function runActions (fbUserId, fbPageId, msg, timestamp, timezone) {
  const reducedMsg = msg.toLowerCase().replace(/\s+/g, '');
  const requestedPickup = time.orderDateTime(msg, timestamp, timezone);

  if (reducedMsg == "menu") {
    return db.getMenu(fbPageId)
      .then(menu => structured.items(menu));
  }
  else if (reducedMsg == "location") {
    return db.findLocation(fbPageId)
      .then(data => text.location(data.location));
  }
  else if (reducedMsg == "myorders" ||
           reducedMsg == "orders" ||
           reducedMsg == "myorder") {
    return db.ordersbyUserid(fbUserId)
      .then(xs => text.hasOrders(xs));
  }
  else if (reducedMsg == "hours" ||
           reducedMsg == "hour") {
    return db.checkOpenStatus(fbPageId)
      .then(data => text.hours(data));
  }
  else if (chrono.parseDate(msg)) {
    return actions.orderTime(fbUserId, fbPageId, requestedPickup, timestamp, timezone)
      .then(order => order.toMessage())
      .catch(err => {
        console.error("error in runActions", err);
        throw {text: txt.orderAttempt.error, quick_replies: QR.basicReplies};
      });
  }
  return actions.defaultResp();
}

module.exports = runActions;
