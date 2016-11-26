/**
 * Created by lewis.knoxstreader on 25/11/16.
 */
const db = require('../repositories/site/CompanyRepository');

class Size {
  constructor ({ parentId, sizeid, size, size_price }) {
    this.typeid = parentId;
    this.sizeid = sizeid;
    this.size = size;
    this.size_price = size_price;
  }

  dbInsert () {
    return db.insertSize(this.size, this.typeid)
      .then(size => size ? size : new Error("failed to insert type into database"));
  }
}

module.exports = Size;
