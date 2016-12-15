/**
 * Created by lewis.knoxstreader on 15/12/16.
 */
const chrono = require('chrono-node'),
  Either = require('ramda-fantasy').Either,
  Right = Either.Right,
  Left = Either.Left,
  { orderAttempt } = require('../messaging/message-list');

const parseHours = data =>
  Either.of({
    opentime: chrono.parseDate(data.opentime),
    closetime: chrono.parseDate(data.closetime)
  });

const validTime = time =>
  time ? Right(time) : Left(orderAttempt.noTime);

const inRange = (requestTime, hours) =>
requestTime >  hours.opentime && requestTime < hours.closetime;

const withinHours = (hours, plainHours, requestTime) =>
  inRange(requestTime, hours) ?
    Right() :
    Left(orderAttempt.tooLate(plainHours.opentime, plainHours.closetime));

const delayDate = delay =>
  new Date(
    Date.now() + (delay * 60 * 1000));

const compareWaitTime = (delay, request) =>
  request > delayDate(delay) ?
    Right() :
    Left(orderAttempt.minimumWait(delay));

const timeFilter = (data, requestTime) =>
  validTime(requestTime)
    .chain(_ =>
      parseHours(data))
    .chain(hours =>
      withinHours(hours, data, requestTime))
    .chain(_ =>
      compareWaitTime(data.delay, requestTime));

const canIPlace = (data, requestTime) =>
  data.status ?
    timeFilter(data, requestTime) :
    Left(orderAttempt.closed);

module.exports = {
  canIPlace
};
