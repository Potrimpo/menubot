/**
 * Created by lewis.knoxstreader on 6/12/16.
 */

const chrono = require('chrono-node'),
  { redisRecordOrder } = require('./messengerSessions'),
  QR = require('./quick-replies');

function postbackHours (hours) {
  const response = {
    quick_replies: QR.hoursReplies()
  };
  switch (hours.status) {
    case false:
      response.text = "Sorry! We're not open today";
      return response;

    case true:
      response.text = `We're open between ${hours.opentime} and ${hours.closetime} today`;
      return response;
  }
}

function openStatus (data, fbUserId, payload) {
  const response = {
    quick_replies: QR.hoursReplies()
  };
  console.log("company status =", data.status);
  switch (data.status) {
    case true:
      return filterHours({
        opentime: data.opentime,
        closetime: data.closetime
      }, payload, fbUserId)
        .then(text => {
          response.text = text;
          return response;
        });

    case false:
      response.text = "Sorry! We're not open today!";
      return response;
  }
}

function filterHours (hours, payload, fbUserId) {
  return new Promise((res, rej) => {
    const now = Date.now();
    if (now > chrono.parseDate(hours.closetime)) {
      return res(`Sorry! We're only open between ${hours.opentime} and ${hours.closetime} today!`);
    }
    else {
      return redisRecordOrder(fbUserId, payload)
        .then(() => res("What time would you like that? (include am/pm)"))
        .catch(err => rej(err));
    }
  })
}

module.exports = {
  openStatus,
  postbackHours
};