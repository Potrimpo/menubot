/**
 * Created by lewis.knoxstreader on 25/11/16.
 */
const chrono = require('chrono-node'),
  { pub } = require('../redis-init'),
  Item = require('./Item'),
  Type = require('./Type'),
  Size = require('./Size');

class Order {
  constructor (fields) {
    this.orderid = fields.orderid;
    this.fbid = fields.fbid;
    this.customer_id = fields.customer_id;
    this.pickuptime = fields.pickuptime;

    if (fields.itemid) {
      this.itemVals = new Item({
        itemid: fields.itemid,
        item: fields.item,
        item_price: fields.item_price,
        item_photo: fields.item_photo
      });
      this.depth = "item";
    }

    if (fields.typeid) {
      this.typeVals = new Type({
        typeid: fields.typeid,
        type: fields.type,
        type_price: fields.type_price,
        type_photo: fields.type_photo
      });
      this.depth = "type";
    }

    if (fields.sizeid) {
      this.sizeVals = new Size({
        sizeid: fields.sizeid,
        size: fields.size,
        size_price: fields.size_price
      });
      this.depth = "size";
    }

    Order.publishOnCreate(fields);
  }

  static publishOnCreate (fields) {
    // broadcast order details
    pub.publish(fields.fbid, JSON.stringify(fields));
  }

  readableTime () {
    return chrono.parseDate(String(this.pickuptime));
  }

  get confirmationMsg () {
    switch (this.depth) {
      case "item":
        return `Order for one ${this.itemVals.item} @ ${this.readableTime()}`;

      case "type":
        return `Order for one ${this.typeVals.type} ${this.itemVals.item} @ ${this.readableTime()}`;

      case "size":
        return `Order for one ${this.sizeVals.size} ${this.typeVals.type} ${this.itemVals.item} @ ${this.readableTime()}`;
    }
  }
}

module.exports = Order;
