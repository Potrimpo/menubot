const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// using native es6 promises (mongoose promises deprecated)
mongoose.Promise = global.Promise;


const productSubDocSchem = mongoose.Schema({
  productName: String,
  price: Number,
  image: Schema.Types.Mixed,
});

const companySchem = mongoose.Schema({
  name: String,
  location: String,
  menu: [productSubDocSchem],
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

companySchem.statics.findProduct = function (name, prodName) {
  return this.findOne({ name, 'menu.productName': prodName }, 'menu.productName');
};

const Company = mongoose.model('Company', companySchem),
  Request = mongoose.model('Request', requestsSchem),
  Order = mongoose.model('Order', ordersSchem);

module.exports = {
  Company,
  Request,
  Order
};

// // -- SPINNING UP SERVER --
// mongoose.connect(`mongodb://localhost/menubot`);
// mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
// mongoose.connection.once('open', function() {
//   console.log('mongodb up & running');
// });

// // -- TEST DATABASE VALUES --
// const testCompany = new Company({
//   name: "Menubot-tester",
//   location: "middle of nowhere",
//   menu: [
//     { productName: 'tea', price: 5 }
//   ],
//   requests: mongoose.Types.ObjectId(),
//   orders: mongoose.Types.ObjectId(),
// });
//
// const testRequests = new Request({
//   _id: testCompany.requests,
//   company: testCompany.id,
//   requests: []
// });
//
// const testOrders = new Order({
//   _id: testCompany.orders,
//   company: testCompany.id,
//   orders: []
// });
//
// // -- SAVE TEST VALUES --
// testCompany.save()
//   .then(data => {
//     console.log(`success saving ${data.name}`);
//     console.log(`${data.menu[0].productName} is on the menu`);
//     return Company.findOne({ "name": data.name})
//   })
//   .then(data => {
//     console.log(`testCompany: ${data.name} located at ${data.location}`);
//   })
//   .catch(err => console.error(err));
//
// testRequests.save()
//   .then(data => {
//     console.log(`success saving requestlist on company: ${data.company}`);
//   })
//   .catch(err => console.error(err));
//
// testOrders.save()
//   .then(data => {
//     console.log(`success saving requestlist on company: ${data.company}`);
//   })
//   .catch(err => console.error(err));

// Company.findProduct('Menubot-tester', 'tea');
