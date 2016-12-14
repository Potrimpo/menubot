/**
 * Created by lewis.knoxstreader on 6/12/16.
 */

const chrono = require('chrono-node'),
  { redisRecordOrder } = require('./messengerSessions'),
  QR = require('./quick-replies');

const orderAttempt = {
  closed: "Sorry! We aren't open today!",
  open: {
    success: "What time would you like that? (include am/pm)",
    tooLate: (open, close) => `Sorry! We're only open between ${open} and ${close} today!`
  },
  error: "Sorry, we had some trouble processing that"
};

const hoursCheck = {
  open: (open, close) => `We're open between ${open} and ${close} today`,
  closed: "Sorry! We're not open today"
};

const postbackHours = hours => ({
  text: hours.status ? hoursCheck.open(hours.opentime, hours.closetime) : hoursCheck.closed,
  quick_replies: QR.hoursReplies()
});


function openStatus (data, fbUserId, payload) {
  const resp = {
    quick_replies: QR.hoursReplies()
  };

  return data.status ?
    open(data, fbUserId, payload, resp) :
    Object.assign(resp, { text: orderAttempt.closed })
}

function open (data, fbUserId, payload, resp) {
  if (isTooLate(data.closetime)) return orderAttempt.open.tooLate(data.opentime, data.closetime);

  // no quickreplies if successful
  return redisRecordOrder(fbUserId, payload)
    .then(() => orderAttempt.open.success)
    .catch(() =>
      Object.assign(resp, { text: orderAttempt.error })
    );
}

function isTooLate (closetime) {
  return Date.now() > chrono.parseDate(closetime);
}

module.exports = {
  postbackHours,
  openStatus
};