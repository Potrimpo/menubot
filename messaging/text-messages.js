const Identity = require('ramda-fantasy').Identity,
  { redisRecordOrder, redisRetrieveOrder } = require('./../state-and-sessions/messengerSessions'),
  time = require('./time-management'),
  QR = require('./quick-replies'),
  structured = require('./structured-messages'),
  txt = require('./message-list');

const wrapQuickreplies = (text, qrs) => ({
  quick_replies: qrs,
  text
});

const defaultResponse = wrapQuickreplies(txt.confused, QR.basicReplies);

const getHours = hours =>
  hours.status ?
    txt.hoursCheck.open(hours.opentime, hours.closetime) :
    txt.hoursCheck.closed;

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
    Object.assign(resp, { text: txt.orderAttempt.closed })
}

function open (data, fbUserId, payload, resp, timestamp) {

  if (isTooLate(data.closetime, data.timezone, timestamp)) {
    return Object.assign(resp, { text: txt.orderAttempt.tooLate(data.opentime, data.closetime) });
  }

  // no quickreplies if successful
  return redisRecordOrder(fbUserId, payload)
    .then(() => txt.orderAttempt.open)
    .catch(() =>
      Object.assign(resp, { text: txt.orderAttempt.error })
    );
}

const isTooLate = (closetime, timezone, timestamp) =>
  new Date() > time.orderDateTime(closetime, timestamp, timezone);

const hasLocation = loc =>
  loc ? txt.locationCheck.found(loc) : txt.locationCheck.notFound;

const location = loc =>
  Identity(hasLocation(loc))
    .map(resp =>
      wrapQuickreplies(resp, QR.basicReplies))
    .get();

const emptyArray = xs =>
  Array.isArray(xs) && xs.length > 0;

const hasOrders = xs =>
  emptyArray(xs) ? structured.orders(xs) : wrapQuickreplies(txt.noOrders, QR.basicReplies);

const menu = xs =>
  emptyArray(xs) ? structured.items(xs) : wrapQuickreplies(txt.emptyMenu, QR.basicReplies);

const quantity = (pageId, userId, payload) =>
  redisRetrieveOrder(userId)
    .then((order) => {
      const newOrder = {
        itemid: order.itemid,
        typeid: order.typeid,
        sizeid: order.sizeid,
        quantity: payload.quantity
      };
      return redisRecordOrder(userId, newOrder)
    })
    .then(() => ({
      text: orderAttempt.open
    }))
    .catch(_ => ({
      text: orderAttempt.error
    }));

module.exports = {
  defaultResponse,
  hours,
  openStatus,
  location,
  hasOrders,
  quantity,
  menu
};
