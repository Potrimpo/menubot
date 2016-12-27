/**
 * Created by lewis.knoxstreader on 24/10/16.
 */

const chrono = require('chrono-node'),
  actions = require('./actions'),
  db = require('../../repositories/bot/botQueries');

function runActions (fbUserId, fbPageId, msg) {
  // the only text messages it knows how to deals with are order times
  const time = chrono.parseDate(msg);
  if (time) {
    return db.checkTimezone(fbPageId)
      .then(data => {
        if (process.env.NODE_ENV == 'production') {
          var correctedTime = chrono.parseDate(msg + data.timezone);
          console.log("Time before parse = "+msg + data.timezone);
          console.log("Corrected time = "+correctedTime);
          console.log("Uncorrected time = " + time);
          return actions.orderTime(fbUserId, fbPageId, correctedTime)
        }
        console.log("Just normal time = "+time);
        return actions.orderTime(fbUserId, fbPageId, time)
      })
      .then(order => order.toMessage())
      .catch(err => {
        console.error("error in runActions", err);
        throw "Sorry! we couldn't place that order for some reason!";
      });
  }
  return actions.defaultResp();
}

module.exports = runActions;
