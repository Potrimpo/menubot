const chrono = require('chrono-node'),
  Identity = require('ramda-fantasy').Identity,
  moment = require('moment-timezone'),
  { redisRecordOrder, redisRetrieveOrder } = require('./../state-and-sessions/messengerSessions'),
  time = require('./time-management'),
  QR = require('./quick-replies'),
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
    .then(() => {
      return {text: orderAttempt.howMany, quick_replies: QR.quantityReplies(payload.price)}
    })
    .catch(() =>
      Object.assign(resp, { text: orderAttempt.error })
    );
}

const isTooLate = (closetime, timezone, timestamp) =>
  new Date() > time.orderDateTime(closetime, timestamp, timezone);

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

const quantity = (pageId, userId, payload) =>
  redisRetrieveOrder(userId)
    .then((order) => {
      const newOrder = {
        itemid: order.itemid ? order.itemid : undefined,
        typeid: order.typeid ? order.typeid : undefined,
        sizeid: order.sizeid ? order.sizeid : undefined,
        quantity: payload.quantity
      };
      return redisRecordOrder(userId, newOrder)
    })
    .then(() => {
      return {text: orderAttempt.open}
    })
    .catch((err) => {
      return {text: orderAttempt.error}
    })

module.exports = {
  defaultResponse,
  hours,
  openStatus,
  location,
  hasOrders,
  quantity
};
