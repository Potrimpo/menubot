const actions = require('../actions'),
  expect = require('chai').expect,
  mongoose = require('mongoose');

// DON'T PUT CATCH STATEMENTS IN PROMISES. WHEN AN ASSERTION FAILS IT ERRORS
// CATCH STATEMENTS WILL STOP MOCHA FROM PICKING UP ON THE FAILURE

describe('testing bot actions with database (mocked query values)', function() {
  before(function (done) {
    // Setting up server
    mongoose.connect(`mongodb://localhost/menubot`);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function() {
      console.log('mongodb connected');
      done();
    });
  });

  it("checks for products using item it DOESN'T have", function() {
    const testValue = { product:
      [ { confidence: 'x value',
        type: 'value',
        value: 'chocolate',
        suggested: true } ]
    };

    return actions.checkProduct({ context: {}, entities: testValue })
      .then(function (data) {
        console.log(data);
        expect(data).to.not.haveOwnProperty('productInfo');
        expect(data).to.have.property('itemNotFound', true);
      })
  });

  it('checks for products using item it DOES have', function () {
    const testValueTrue = { product:
      [ { confidence: 'x value',
        type: 'value',
        value: 'coffee',
        suggested: true } ]
    };

    return actions.checkProduct({ context: {}, entities: testValueTrue })
      .then(function (data) {
        console.log(data);
        expect(data).to.not.haveOwnProperty('itemNotFound');
        expect(data).to.have.property('productInfo', 'coffee');
      })
  })
});
