/**
 * Created by lewis.knoxstreader on 6/12/16.
 */

const chrono = require('chrono-node'),
  Identity = require('ramda-fantasy').Identity,
  { redisRecordOrder } = require('./../state-and-sessions/messengerSessions'),
  QR = require('./quick-replies'),
  { orderAttempt, hoursCheck, locationCheck, confused } = require('./message-list');

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
  if (isTooLate(data.closetime)) return orderAttempt.tooLate(data.opentime, data.closetime);

  // no quickreplies if successful
  return redisRecordOrder(fbUserId, payload)
    .then(() => orderAttempt.open)
    .catch(() =>
      Object.assign(resp, { text: orderAttempt.error })
    );
}

function isTooLate (closetime) {
  return Date.now() > chrono.parseDate(closetime);
}

const hasLocation = loc =>
  loc ? locationCheck.found(loc) : locationCheck.notFound;

const location = loc =>
  Identity(hasLocation(loc))
    .map(resp =>
      wrapQuickreplies(resp, QR.basicReplies))
    .get();

module.exports = {
  defaultResponse,
  hours,
  openStatus,
  location
};