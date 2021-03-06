const db = require('../repositories/site/CompanyRepository');

class Type {
  constructor ({ fbid, itemid, parentId, typeid, id, type, type_photo, type_price, price }) {
    this.fbid = fbid;
    this.itemid = itemid || parentId;
    this.typeid = typeid || id;
    this.type = type;
    this.type_photo = type_photo;
    this.type_price = type_price || price;
  }

  dbInsert () {
    return db.insertType(this.type, this.itemid, this.fbid)
      .catch(err => console.error("error inserting Type into database:", err));
  }

  updatePrice () {
    return db.updateTPrice(this.typeid, this.type_price)
      .catch(err => console.error("error updating Type price:", err));
  }
}

module.exports = Type;
