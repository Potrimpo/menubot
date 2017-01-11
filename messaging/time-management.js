const chrono = require('chrono-node'),
  moment = require('moment-timezone'),
  Either = require('ramda-fantasy').Either,
  Right = Either.Right,
  Left = Either.Left,
  QR = require('./quick-replies'),
  { orderAttempt } = require('../messaging/message-list');


const wrapQuickreplies = (text) => ({
  quick_replies: QR.hoursReplies,
  text
});

const orderDateTime = (time, tStamp, tz) => {
  const messageDate = moment.tz(tStamp, tz);

  const dateFormat = messageDate.format("M/D/YYYY"),
          dateZone = messageDate.format("ZZ");

  return chrono.parseDate(dateFormat + " " + time + " " + dateZone);
};

const parseHours = (data, timestamp) =>
  Either.of({
    opentime: orderDateTime(data.opentime, timestamp, data.timezone),
    closetime: orderDateTime(data.closetime, timestamp, data.timezone)
  });


const inRange = (requestTime, hours) =>
requestTime >  hours.opentime && requestTime < hours.closetime;

const withinHours = (hours, plainHours, requestTime) =>
  inRange(requestTime, hours) ?
    Right() :
    Left(wrapQuickreplies(orderAttempt.tooLate(plainHours.opentime, plainHours.closetime)));

const delayDate = delay =>
  new Date(Date.now() + (delay * 60 * 1000));

const compareWaitTime = (delay, request) =>
  request > delayDate(delay) ?
    Right() :
    Left(wrapQuickreplies(orderAttempt.minimumWait(delay)));

const timeFilter = (data, requestTime, timestamp) =>
  parseHours(data, timestamp)
    .chain(hours =>
      withinHours(hours, data, requestTime))
    .chain(_ =>
      compareWaitTime(data.delay, requestTime));

const canIPlace = (data, requestTime, timestamp) =>
  data.status ?
    timeFilter(data, requestTime, timestamp) :
    Left(wrapQuickreplies(orderAttempt.closed));

module.exports = {
  canIPlace,
  orderDateTime
};
