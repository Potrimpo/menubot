const actions = require('../actions'),
  chai = require('chai'),
  chaiHttp = require('chai-http'),
  mongoose = require('mongoose'),
  crypto = require('crypto'),
  { FB_APP_SECRET, tunnelURL } = require('../index');

// const app = require('../app');
const expect = chai.expect;
chai.use(chaiHttp);

// DON'T PUT CATCH STATEMENTS IN MOCHA-INVOLVED PROMISES. WHEN AN ASSERTION FAILS IT ERRORS
// CATCH STATEMENTS WILL STOP MOCHA FROM PICKING UP ON THE FAILURE

describe('integration & use case tests', function() {
  // before(function (done) {
  //   // Setting up server
  //   mongoose.connect(`mongodb://localhost/menubot`);
  //   mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
  //   mongoose.connection.once('open', function() {
  //     console.log('mongodb connected');
  //     done();
  //   });
  // });

  describe('testing whole system', function () {
    it('pinging base path (/)', function () {
      chai.request(tunnelURL)
        .get('/')
        .then(function (res) {
          expect(res).to.have.status(200);
        });
    });

    it('sending message to bot from test user', function () {
      const dummyRequest = {
        object: 'page',
        entry: [
          { id: '1766837970261548',
          // time: 1471048736060,
          messaging: [
            {
              sender: { id: '111926652588920' },
              recipient: { id: '1766837970261548' },
              // timestamp: 1471051769301,
              message: {
                mid: 'mid.1471051769294:ccd122d066ed3d7c18',
                seq: 50,
                text: 'you got coffee?'
              }
            }
          ]
          }
        ]
      };
      const myGenHash = crypto.createHmac('sha1', FB_APP_SECRET)
        .update(Buffer.from(JSON.stringify(dummyRequest)))
        .digest('hex');

      chai.request(tunnelURL)
        .post('/webhook')
        .set("x-hub-signature", `sha1=${myGenHash}`)
        .send(dummyRequest)
        .then(function (res) {
          console.log(' --- MUCHO SUCCESSO ---');
          console.log(res.body);
          console.log(`res.body ^^`);
          expect(res).to.have.status(200);
        })
    })
  });

  describe('testing bot actions with database', function() {
    it("checks for products using item it DOESN'T have", function() {
      const mockQuery = { product:
        [ { type: 'value',
          value: 'chocolate',
          suggested: true } ]
      };

      return actions.checkProduct({ context: {}, entities: mockQuery })
        .then(function (data) {
          expect(data).to.not.haveOwnProperty('productInfo');
          expect(data).to.have.property('itemNotFound', true);
        })
    });

    it('checks for products using item it DOES have', function () {
      const mockQueryTrue = { product:
        [ { type: 'value',
          value: 'coffee',
          suggested: true } ]
      };

      return actions.checkProduct({ context: {}, entities: mockQueryTrue })
        .then(function (data) {
          expect(data).to.not.haveOwnProperty('itemNotFound');
          expect(data).to.have.property('productInfo', 'coffee');
        })
    })
  });
});
