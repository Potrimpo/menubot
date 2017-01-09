const { formatAndParseTime } = require('../time-management'),
  actions = require('./actions');

function runActions (fbUserId, fbPageId, msg, timestamp, timezone) {
  // the only text messages it knows how to deals with are order times
  const requestedPickup = formatAndParseTime(msg, timestamp, timezone);
  if (requestedPickup) {
    return actions.orderTime(fbUserId, fbPageId, requestedPickup, timestamp, timezone)
      .then(order => order.toMessage())
      .catch(err => {
        console.error("error in runActions", err);
        throw "Sorry! we couldn't place that order for some reason!";
      });
  }
  return actions.defaultResp();
}

module.exports = runActions;
