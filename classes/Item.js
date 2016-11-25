/**
 * Created by lewis.knoxstreader on 25/11/16.
 */

class Item {
  constructor ({ fbid, itemid, item, item_photo, item_price }) {
    this.fbid = fbid;
    this.itemid = itemid;
    this.item = item;
    this.item_photo = item_photo;
    this.item_price = item_price;
  }
}

module.exports = Item;
