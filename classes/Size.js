/**
 * Created by lewis.knoxstreader on 25/11/16.
 */
const db = require('../repositories/site/CompanyRepository');

class Size {
  constructor ({ typeid, parentId, sizeid, id, size, size_price, price }) {
    this.typeid = typeid || parentId;
    this.sizeid = sizeid || id;
    this.size = size;
    this.size_price = size_price || price;
  }

  dbInsert () {
    return db.insertSize(this.size, this.typeid)
      .catch(err => console.error("error inserting Size into database:", err));
  }

  updatePrice () {
    return db.updateSPrice(this.sizeid, this.size_price)
      .catch(err => console.error("error updating Size price:", err));
  }
}

module.exports = Size;
