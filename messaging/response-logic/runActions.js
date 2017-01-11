const actions = require('./actions'),
  time = require('../time-management'),
  txt = require('../message-list');

function runActions (fbUserId, fbPageId, msg, timestamp, timezone) {
  // the only text messages it knows how to deals with are order times
  const requestedPickup = time.orderDateTime(msg, timestamp, timezone);
  if (requestedPickup) {
    return actions.orderTime(fbUserId, fbPageId, requestedPickup, timestamp, timezone)
      .then(order => order.toMessage())
      .catch(err => {
        console.error("error in runActions", err);
        throw txt.orderAttempt.error;
      });
  }
  return actions.defaultResp();
}

module.exports = runActions;
