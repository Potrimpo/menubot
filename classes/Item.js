/**
 * Created by lewis.knoxstreader on 25/11/16.
 */
const db = require('../repositories/site/CompanyRepository');

class Item {
  constructor ({ fbid, itemid, id, item, item_photo, item_price, price }) {
    this.fbid = fbid;
    this.itemid = itemid || id;
    this.item = item;
    this.item_photo = item_photo;
    this.item_price = item_price || price;
  }

  dbInsert () {
    return db.insertItem(this.fbid, this.item)
      .catch(err => console.error("error inserting Item into database", err));
  }

  updatePrice () {
    return db.updateIPrice(this.itemid, this.item_price)
      .catch(err => console.error("error updating Item price", err));
  }
}

module.exports = Item;
