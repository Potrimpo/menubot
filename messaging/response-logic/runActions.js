const actions = require('./actions'),
  time = require('../time-management'),
  commands = require('../bot-commands'),
  QR = require('../quick-replies'),
  txt = require('../message-list');

function runActions (fbUserId, fbPageId, msg, timestamp, timezone) {
  const reducedMsg = msg.toLowerCase().replace(/\s+/g, '');
  const requestedPickup = time.orderDateTime(msg, timestamp, timezone);

  switch (reducedMsg) {
    case "menu":
      return commands.getMenu(fbPageId);
    case "location":
      return commands.getLocation(fbPageId);
    case "myorders" || "orders" || "myorder":
      return commands.myOrders(fbUserId);
    case "hours" || "hour":
      return commands.getHours(fbPageId);
    case requestedPickup:
      return actions.orderTime(fbUserId, fbPageId, requestedPickup, timestamp, timezone)
        .then(order => order.toMessage())
        .catch(err => {
          console.error("error in runActions", err);
          throw {text: txt.orderAttempt.error, quick_replies: QR.basicReplies};
        });
    default:
      return actions.defaultResp();
  }
}

module.exports = runActions;
