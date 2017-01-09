/**
 * Created by lewis.knoxstreader on 15/12/16.
 */
const chrono = require('chrono-node'),
  moment = require('moment-timezone'),
  Identity = require('ramda-fantasy').Identity,
  Either = require('ramda-fantasy').Either,
  Right = Either.Right,
  Left = Either.Left,
  QR = require('./quick-replies'),
  { orderAttempt } = require('../messaging/message-list');

const wrapQuickreplies = (text) => ({
  quick_replies: QR.hoursReplies,
  text
});

// format time from database into human readable notation
const readableTime = (time, tz) =>
  moment.tz(time, tz).format('h:mma, dddd z');

const messageDate = (tStamp, tz) => moment.tz(tStamp, tz);
const dateFormat = momentTime => momentTime.format("M/D/YYYY");
const dateZone = momentTime => momentTime.format("ZZ");

const chronoArgString = (time, metadata) =>
  metadata.format + " " + time + " " + metadata.zone;

// String -> String -> Identity(String)
const parseTime = (time, metadata) =>
  Identity(chronoArgString(time, metadata))
    .map(argString =>
      chrono.parseDate(argString));

// String -> String -> Identity({})
const formatTime = (tStamp, tz) =>
  Identity(messageDate(tStamp, tz))
    .map(momentTime => ({
      format: dateFormat(momentTime),
      zone: dateZone(momentTime)
    }));

// formats date/time information & pipes into chrono-node -> date string we can reason about
const formatAndParseTime = (time, tStamp, tz) =>
  formatTime(tStamp, tz)
    .chain(metadata =>
      parseTime(time, metadata))
    .map(metadata =>
      chrono.parseDate(chronoArgString(time, metadata)))
    .get();

// {} -> String -> Either(null, {})
const parseHours = (data, timestamp) =>
  Either.of({
    opentime: formatAndParseTime(data.opentime, timestamp, data.timezone),
    closetime: formatAndParseTime(data.closetime, timestamp, data.timezone)
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
  formatAndParseTime,
  readableTime
};
