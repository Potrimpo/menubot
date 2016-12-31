/**
 * Created by lewis.knoxstreader on 24/10/16.
 */

const chrono = require('chrono-node'),
  moment = require('moment-timezone'),
  actions = require('./actions');

function runActions (fbUserId, fbPageId, msg, timestamp, timezone) {
  // the only text messages it knows how to deals with are order times
  var messageDate = moment.tz(timestamp, timezone);
  var dateFormat = messageDate.format("M/D/YYYY");
  var dateZone = messageDate.format("ZZ");
  const requestedPickup = chrono.parseDate(dateFormat + " " + msg + " " + dateZone);
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
