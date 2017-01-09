const chrono = require('chrono-node'),
  Identity = require('ramda-fantasy').Identity,
  moment = require('moment-timezone'),
  { redisRecordOrder } = require('./../state-and-sessions/messengerSessions'),
  QR = require('./quick-replies'),
  { formatAndParseTime } = require('./time-management'),
  structured = require('./structured-messages'),
  { orderAttempt, hoursCheck, locationCheck, confused, noOrders } = require('./message-list');

const wrapQuickreplies = (text, qrs) => ({
  quick_replies: qrs,
  text
});

const defaultResponse = wrapQuickreplies(confused, QR.basicReplies);

const getHours = hours =>
  hours.status ?
    hoursCheck.open(hours.opentime, hours.closetime) :
    hoursCheck.closed;

const hours = hours =>
  Identity(getHours(hours))
    .map(resp =>
      wrapQuickreplies(resp, QR.hoursReplies))
    .get();

function openStatus (data, fbUserId, payload, timestamp) {
  const resp = {
    quick_replies: QR.hoursReplies
  };

  return data.status ?
    open(data, fbUserId, payload, resp, timestamp) :
    Object.assign(resp, { text: orderAttempt.closed })
}

function open (data, fbUserId, payload, resp, timestamp) {

  if (isTooLate(data.closetime, data.timezone, timestamp)) {
    return Object.assign(resp, { text: orderAttempt.tooLate(data.opentime, data.closetime) });
  }

  // no quickreplies if successful
  return redisRecordOrder(fbUserId, payload)
    .then(() => orderAttempt.open)
    .catch(() =>
      Object.assign(resp, { text: orderAttempt.error })
    );
}

const isTooLate = (closetime, timezone, timestamp) =>
  new Date() > formatAndParseTime(closetime, timestamp, timezone);

const hasLocation = loc =>
  loc ? locationCheck.found(loc) : locationCheck.notFound;

const location = loc =>
  Identity(hasLocation(loc))
    .map(resp =>
      wrapQuickreplies(resp, QR.basicReplies))
    .get();

const hasNoOrders = wrapQuickreplies(noOrders, QR.basicReplies);

const emptyArray = xs =>
  Array.isArray(xs) && xs.length > 0;

const hasOrders = xs =>
  emptyArray(xs) ? structured.orders(xs) : hasNoOrders;

module.exports = {
  defaultResponse,
  hours,
  openStatus,
  location,
  hasOrders
};
