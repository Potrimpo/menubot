const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// using native es6 promises (mongoose promises deprecated)
mongoose.Promise = global.Promise;


const productSubDoc = mongoose.Schema({
  name: String,
  price: Number,
  image: Schema.Types.Mixed,
});

const companyColl = mongoose.Schema({
  name: String,
  location: String,
  menu: [productSubDoc],
  requests: Schema.Types.ObjectId,
  orders: Schema.Types.ObjectId,
});

const requestsColl = mongoose.Schema({
  company: Schema.Types.ObjectId,
  testWord: String,
  requests: [
    {
      productName: String,
      weight: Number, // number of people that want this
      locations: [String],
    }
  ]
});

const ordersColl = mongoose.Schema({
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

const Company = mongoose.model('Company', companyColl),
  Request = mongoose.model('Request', requestsColl),
  Order = mongoose.model('Order', ordersColl);


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
//     { name: 'tea', price: 5 }
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
//     console.log(`${data.menu[0].name} is on the menu`);
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
