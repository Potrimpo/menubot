/**
 * Created by lewis.knoxstreader on 25/11/16.
 */
const db = require('../repositories/site/CompanyRepository');

class Item {
  constructor ({ fbid, itemid, item, item_photo, item_price }) {
    this.fbid = fbid;
    this.itemid = itemid;
    this.item = item;
    this.item_photo = item_photo;
    this.item_price = item_price;
  }

  dbInsert () {
    return db.insertItem(this.fbid, this.item)
      .then(data => data ? data : new Error("failed to insert Item into db"))
  }
}

module.exports = Item;
