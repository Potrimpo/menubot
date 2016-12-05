/**
 * Created by lewis.knoxstreader on 25/11/16.
 */
const chrono = require('chrono-node'),
  { pub } = require('../redis-init'),
  db = require('../repositories/bot/botQueries'),
  Item = require('./Item'),
  Type = require('./Type'),
  Size = require('./Size');

class Order {
  constructor (fbPageId, fbUserId, msg, data) {
    const time = chrono.parseDate(msg);

    return Order.checkHours(fbPageId, time)
      .then(() =>
        Order.dbInsert(fbPageId, fbUserId, time, data)
      )
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
        this.error = err.message;
        return this;
      });
  }

  // broadcast order details via Redis
  static publishOnCreate (fields) {
    pub.publish(fields.fbid, JSON.stringify(fields));
  }

  // insert order into database, returning values used to create Order instance
  static dbInsert (fbPageId, fbUserId, time, order) {
    if (!time) throw new Error("couldn't parse time from message");
    return db.makeOrder(fbPageId, fbUserId, time, order);
  }

  // check the company is open & requested time is within open hours
  static checkHours (fbPageId, requestTime) {
    return db.checkOpenStatus(fbPageId)
      .then(data => {
        switch (data.status) {
          case false:
            throw new Error("Sorry! We aren't open today");

          case true:
            const opentime = chrono.parseDate(data.opentime),
              closetime = chrono.parseDate(data.closetime);
            if (requestTime <  opentime || requestTime > closetime) {
              throw new Error(`Sorry! We're only open between ${data.opentime} and ${data.closetime} today`);
            }
        }
      })
  }

  toMessage () {
    return this.error ? [this.error] : this.confirmationMsg;
  }

  get readableTime () {
    return chrono.parseDate(String(this.pickuptime));
  }

  get confirmationMsg () {
    const responses = [];

    responses.push("Success!");
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
