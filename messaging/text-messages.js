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
  switch (data.status) {
    case true:
      const hours = {
        opentime: data.opentime,
        closetime: data.closetime
      };

      // no quickreplies if successful
      return filterHours(hours, fbUserId, payload)
        .catch(err => {
          response.text = err;
          return response
        });

    case false:
      response.text = "Sorry! We're not open today!";
      return response;
  }
}

function filterHours (hours, fbUserId, payload) {
  return new Promise((res, rej) => {
    const now = Date.now();

    if (now > chrono.parseDate(hours.closetime)) {
      return rej(`Sorry! We're only open between ${hours.opentime} and ${hours.closetime} today!`);
    }

    return redisRecordOrder(fbUserId, payload)
      .then(() => res("What time would you like that? (include am/pm)"))
      .catch(err => rej("Sorry, we had some trouble processing that"));
  });
}

module.exports = {
  openStatus,
  postbackHours
};