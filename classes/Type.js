/**
 * Created by lewis.knoxstreader on 25/11/16.
 */
const db = require('../repositories/site/CompanyRepository');

class Type {
  constructor ({ parentId, typeid, type, type_photo, type_price }) {
    this.itemid = parentId;
    this.typeid = typeid;
    this.type = type;
    this.type_photo = type_photo;
    this.type_price = type_price;
  }

  dbInsert () {
    return db.insertType(this.type, this.itemid)
      .then(type => type ? type : new Error("failed to insert type into database"));
  }
}

module.exports = Type;
