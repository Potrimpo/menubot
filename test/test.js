const actions = require('../actions'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  mongoose = require('mongoose'),
  app = require('../app');

const expect = chai.expect;
chai.use(chaiHttp);

// DON'T PUT CATCH STATEMENTS IN MOCHA-INVOLVED PROMISES. WHEN AN ASSERTION FAILS IT ERRORS
// CATCH STATEMENTS WILL STOP MOCHA FROM PICKING UP ON THE FAILURE

describe('bot integration & use case tests', function() {
  // before(function (done) {
  //   // Setting up server
  //   mongoose.connect(`mongodb://localhost/menubot`);
  //   mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  //   mongoose.connection.once('open', function() {
  //     console.log('mongodb connected');
  //     done();
  //   });
  // });

  describe('checking server response', function () {
    it('pinging base path (/)', function () {
      chai.request(app)
        .get('/')
        .then(function (res, err) {
          expect(res).to.have.status(200);
          expect(err).to.be.null;
        });
    });
  });

  describe('testing bot actions with database (mocked query values)', function() {
    it("checks for products using item it DOESN'T have", function() {
      const mocQuery = { product:
        [ { confidence: 'x value',
          type: 'value',
          value: 'chocolate',
          suggested: true } ]
      };

      return actions.checkProduct({ context: {}, entities: mocQuery })
        .then(function (data) {
          console.log(data);
          expect(data).to.not.haveOwnProperty('productInfo');
          expect(data).to.have.property('itemNotFound', true);
        })
    });

    it('checks for products using item it DOES have', function () {
      const mockQueryTrue = { product:
        [ { confidence: 'x value',
          type: 'value',
          value: 'coffee',
          suggested: true } ]
      };

      return actions.checkProduct({ context: {}, entities: mockQueryTrue })
        .then(function (data) {
          console.log(data);
          expect(data).to.not.haveOwnProperty('itemNotFound');
          expect(data).to.have.property('productInfo', 'coffee');
        })
    })
  });
});
