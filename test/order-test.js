const chai = require('chai'),
  chaiHttp = require('chai-http'),
  chrono = require('chrono-node'),
  // fs for debugging using writeToFile (in functionsForTests.js)
  // fs = require('fs'),
  { tunnelURL, senderID, testPageID } = require('../envVariables'),
  { postBackFactory, requestMessageFactory, hashMyMessage } = require('./functionsForTests'),
  { Order } = require('./../database');
  // { findOrder } = require('../sql');

const expect = chai.expect;
chai.use(chaiHttp);

describe('testing order functionality', function () {
  const typeid = 1,
        sizeid = 1,
        testTime = '10am';

  let dummyRequest,
      myGenHash;
  this.timeout(8000);

  afterEach(function (done) { setTimeout(done, 4000) });

  it('should store details in conversation context', function () {
    const requestString = `ORDER!${typeid}/${sizeid}`;
    dummyRequest = postBackFactory(requestString);
    myGenHash = hashMyMessage(dummyRequest);

    // myGenHash = crypto.createHmac('sha1', FB_APP_SECRET)
    //   .update(Buffer.from(JSON.stringify(dummyRequest)))
    //   .digest('hex');

    return chai.request(tunnelURL)
      .post('/webhook')
      .set("x-hub-signature", `sha1=${myGenHash}`)
      .send(dummyRequest)
      .then(function (res) {
        // this is the request object, not the response we want to be testing
        expect(res).to.have.status(200);
      });
  });

  it('place an order', function () {
    dummyRequest = requestMessageFactory(testTime);
    myGenHash = hashMyMessage(dummyRequest);

    // myGenHash = crypto.createHmac('sha1', FB_APP_SECRET)
    //   .update(Buffer.from(JSON.stringify(dummyRequest)))
    //   .digest('hex');

    return chai.request(tunnelURL)
      .post('/webhook')
      .set("x-hub-signature", `sha1=${myGenHash}`)
      .send(dummyRequest)
      .then(function (res) {
        // this is the request object, not the response we want to be testing
        expect(res).to.have.status(200);
      });

  });

  it('check if order was made', function () {
      return Order.findOrder(testPageID, senderID, sizeid)
        .then(function (data) {
          expect(data.pickuptime).to.exist;
          expect(chrono.parseDate(String(data.pickuptime))).to.equal(chrono.parseDate(String(testTime)));
        })
    })
});
