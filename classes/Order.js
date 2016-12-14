/**
 * Created by lewis.knoxstreader on 25/11/16.
 */
const Either = require('ramda-fantasy').Either,
  Right = Either.Right,
  Left = Either.Left,
  chrono = require('chrono-node'),
  { pub } = require('../redis-init'),
  db = require('../repositories/bot/botQueries'),
  Item = require('./Item'),
  Type = require('./Type'),
  Size = require('./Size');

const orderAttempt = {
  closed: "Sorry! We aren't open today",
  noTime: "Sorry, we couldn't understand the time you gave us",
  outOfRange: hours => `Sorry! We're only open between ${hours.opentime} and ${hours.closetime} today`,
  minimumWait: delay => `Sorry, it'll be at least ${delay} minutes before we can get that to you!`
};

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
    Left(orderAttempt.outOfRange(plainHours));

const delayDate = delay =>
  new Date(
    Date.now() + (delay * 60 * 1000));

const compareWaitTime = (delay, request) =>
  request > delayDate(delay) ?
    Right() :
    Left(orderAttempt.minimumWait(delay));

const throwE = e => {
  throw e;
};

const timeChecking = (data, requestTime) =>
  validTime(requestTime)
    .chain(_ =>
      parseHours(data))
    .chain(hours =>
      withinHours(hours, data, requestTime))
    .chain(_ =>
      compareWaitTime(data.delay, requestTime));

const throwLeft = Either.either(throwE, x => x);

class Order {
  constructor (fbPageId, fbUserId, msg, data) {
    const time = chrono.parseDate(msg);

    return Order.checkHours(fbPageId, time)
      .then(() =>
        Order.dbInsert(fbPageId, fbUserId, time, data))
      .then(fields => {
        fields = fields[0];

        this.orderid = fields.orderid;
        this.fbid = fields.fbid;
        this.customer_id = fields.customer_id;
        this.pickuptime = fields.pickuptime;

        if (fields.itemid) {
          this.itemVals = new Item(fields);
          this.depth = "item";
        }

        if (fields.typeid) {
          this.typeVals = new Type(fields);
          this.depth = "type";
        }

        if (fields.sizeid) {
          this.sizeVals = new Size(fields);
          this.depth = "size";
        }

        Order.publishOnCreate(fields);
        return this;
      })
      .catch(err => {
        console.error("error creating Order", err);
        this.error = err;
        return this;
      });
  }

  // broadcast order details via Redis
  static publishOnCreate (fields) {
    pub.publish(fields.fbid, JSON.stringify(fields));
  }

  // insert order into database, returning values used to create Order instance
  static dbInsert (fbPageId, fbUserId, time, order) {
    return db.makeOrder(fbPageId, fbUserId, time, order);
  }

  // check the company is open & requested time is within open hours
  static checkHours (fbPageId, requestTime) {
    return db.checkOpenStatus(fbPageId)
      .then(data => {
        switch (data.status) {
          case false:
            return throwLeft(
              Left(orderAttempt.closed));

          case true:
            return throwLeft(
              timeChecking(data, requestTime));
        }
      });
  }

  toMessage () {
    return this.error ? this.error : this.confirmationMsg;
  }

  get readableTime () {
    return chrono.parseDate(String(this.pickuptime));
  }

  get confirmationMsg () {
    const responses = [];

    responses.push(
      orderConfirm("Success!")
    );
    switch (this.depth) {
      case "item":
        responses.push(
          orderConfirm(`Order for one ${this.itemVals.item} @ ${this.readableTime}`)
        );
        break;

      case "type":
        responses.push(
          orderConfirm(`Order for one ${this.typeVals.type} ${this.itemVals.item} @ ${this.readableTime}`)
        );
        break;

      case "size":
        responses.push(
          orderConfirm(`Order for one ${this.sizeVals.size} ${this.typeVals.type} ${this.itemVals.item} @ ${this.readableTime}`)
        );
        break;
    }
    return responses;
  }
}

function orderConfirm (text) {
  return {
    text: text,
    quick_replies: [{
      content_type: "text",
      title: "Menu",
      payload: JSON.stringify({ intent: "MENU" })
    }, {
      content_type: "text",
      title: "My Orders",
      payload: JSON.stringify({ intent: "MY_ORDERS" })
    }]
  };
}


module.exports = Order;
