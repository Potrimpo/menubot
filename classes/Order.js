/**
 * Created by lewis.knoxstreader on 25/11/16.
 */
const Either = require('ramda-fantasy').Either,
  chrono = require('chrono-node'),
  { pub } = require('../state-and-sessions/redis-init'),
  db = require('../repositories/bot/botQueries'),
  { canIPlace } = require('../messaging/time-management'),
  Item = require('./Item'),
  Type = require('./Type'),
  Size = require('./Size');

const throwE = e => {
  throw e;
};

const throwLeft = Either.either(throwE, x => x);

class Order {
  constructor (fbPageId, fbUserId, time, data) {
    console.log("Time message = " + time);
    return Order.checkHours(fbPageId, time)
      .then(() =>
        Order.correctTime(time, fbPageId))
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

  // check the company is open, requested time is within open hours & after minimum delay time
  static checkHours (fbPageId, requestTime) {
    return db.checkOpenStatus(fbPageId)
      .then(data =>
        throwLeft(
          canIPlace(data, requestTime)));
  }

  static correctTime (pickupTime, fbPageId) {
    console.log(String(pickupTime).length);
    var snipper = String(pickupTime).length - 36;
    var reducedPickupTime = String(pickupTime).substring(0, String(pickupTime).length - 12 - snipper);
    console.log("Substring of pickup time: " + reducedPickupTime);
    return db.checkTimezone(fbPageId)
      .then(data => {
        console.log("corrected pickuptime, after substringing : " + chrono.parseDate(reducedPickupTime + data.timezone));
        return reducedPickupTime
      })
  }

  toMessage () {
    return this.error ? this.error : this.confirmationMsg;
  }

  get readableTime () {
    console.log("The string of the pickuptime about to be set as the order's pickup time: " + String(this.pickuptime));
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
