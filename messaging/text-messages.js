/**
 * Created by lewis.knoxstreader on 6/12/16.
 */

const chrono = require('chrono-node'),
  Identity = require('ramda-fantasy').Identity,
  { redisRecordOrder } = require('./../state-and-sessions/messengerSessions'),
  QR = require('./quick-replies'),
  structured = require('./structured-messages'),
  { orderAttempt, hoursCheck, locationCheck, confused, noOrders } = require('./message-list')

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

function openStatus (data, fbUserId, payload) {
  const resp = {
    quick_replies: QR.hoursReplies
  };

  return data.status ?
    open(data, fbUserId, payload, resp) :
    Object.assign(resp, { text: orderAttempt.closed })
}

function open (data, fbUserId, payload, resp) {

  if (isTooLate(data.closetime, data.timezone)) {
    return Object.assign(resp, { text: orderAttempt.tooLate(data.opentime, data.closetime) });
  }

  // no quickreplies if successful
  return redisRecordOrder(fbUserId, payload)
    .then(() => orderAttempt.open)
    .catch(() =>
      Object.assign(resp, { text: orderAttempt.error })
    );
}

function isTooLate (closetime, timezone) {
  if (process.env.NODE_ENV == 'production') {
    console.log("As it's currently production :");
    console.log("------");
    console.log("new Date() = " + new Date());
    console.log(new Date());
    console.log("chrono.parseDate(closetime) = " + chrono.parseDate(closetime));
    console.log(chrono.parseDate(closetime));
    console.log("------");
    console.log('Closetime parse date object with timezone adjustment = ' + chrono.parseDate(closetime + timezone));
    console.log(chrono.parseDate(closetime + timezone));
    console.log("------");
    return new Date() > chrono.parseDate(closetime + timezone);
  }
  console.log("As it's currently development: ");
  console.log("new Date() = " + new Date());
  console.log(new Date());
  console.log("------");
  console.log("chrono.parseDate(closetime) = " + chrono.parseDate(closetime));
  console.log(chrono.parseDate(closetime));
  return new Date() > chrono.parseDate(closetime);
}

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
