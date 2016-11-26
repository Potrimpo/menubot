/**
 * Created by lewis.knoxstreader on 25/11/16.
 */
const db = require('../repositories/site/CompanyRepository');

class Item {
  constructor ({ fbid, itemid, parentId, item, item_photo, item_price, price }) {
    this.fbid = fbid;
    this.itemid = itemid || parentId;
    this.item = item;
    this.item_photo = item_photo;
    this.item_price = item_price || price;
  }

  dbInsert () {
    return db.insertItem(this.fbid, this.item)
      .then(data => data ? data : new Error("failed to insert Item into db"))
  }

  updatePrice () {
    return db.updateIPrice(this.itemid, this.item_price)
      .then(data => data[0] > 0 ? data : new Error("failed to update Item price"));
  }
}

module.exports = Item;
