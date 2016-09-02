const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// using native es6 promises (mongoose promises deprecated)
mongoose.Promise = global.Promise;

const productSchem = mongoose.Schema({
  name: String,
  sizes: [
    { size: String, price: Number },
  ],
  image: Schema.Types.Mixed,
});

const productCategorySchem = mongoose.Schema({
  name: String,
  types: [productSchem],
  image: Schema.Types.Mixed,
});

const companySchem = mongoose.Schema({
  fbID: String,
  name: String,
  location: String,
  menu: [productCategorySchem],
  requests: Schema.Types.ObjectId,
  orders: Schema.Types.ObjectId,
});

const requestsSchem = mongoose.Schema({
  company: Schema.Types.ObjectId,
  requests: [
    {
      productName: String,
      weight: Number, // number of people that want this
      locations: [String],
    }
  ]
});

const ordersSchem = mongoose.Schema({
  company: Schema.Types.ObjectId,
  orders: [
    {
      productId: Schema.Types.ObjectId,
      timeOrdered: Date,
      timeWanted: Date,
      paymentMethod: String,
    }
  ]
});

companySchem.statics.findProduct = function (fbID, prodName) {
  return this.findOne({ fbID }, { menu: { $elemMatch: { name: prodName } } } );
};

companySchem.statics.findLocation = function (fbID) {
  return this.findOne({ fbID }, 'location');
};

companySchem.statics.getMenu = function (fbID, specificItem) {
  return this.findOne({ fbID }, 'menu');
};

companySchem.statics.getSizes = function (fbID, item) {
  return this.findOne({ name: "Menubot-tester" }, { menu: { $elemMatch: { name: specificItem } } } );
};

const Company = mongoose.model('Company', companySchem),
  Request = mongoose.model('Request', requestsSchem),
  Order = mongoose.model('Order', ordersSchem);

module.exports = {
  Company,
  Request,
  Order
};
