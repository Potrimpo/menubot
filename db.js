const mongoose = require('mongoose');

// using native es6 promises (mongoose promises deprecated)
mongoose.Promise = global.Promise;

const menuItem = mongoose.Schema({
  name: String,
  price: Number
});

const ProductList = mongoose.model('Products', menuItem);

// const coffee = new ProductList({
//   name: 'coffee', price: 2
// });
//
// const sandwiches = new ProductList({
//   name: 'sandwiches', price: 1
// });
//
// coffee.save()
//   .then(data => {
//     console.log(`success saving ${data.name}`);
//   })
//   .then(() => {
//   sandwiches.save()
//   })
//   .then(data => {
//     console.log(`success saving ${data.name}`);
//   })
//   .then(() => {
//     ProductList.findOne({ name: 'coffee'})
//   })
//   .then(data => {
//       console.log(data);
//     })
//   .catch(err => console.error(err));

module.exports = ProductList;
