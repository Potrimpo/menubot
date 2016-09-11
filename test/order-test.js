const chai = require('chai'),
  chaiHttp = require('chai-http'),
  crypto = require('crypto'),
  // fs for debugging using writeToFile (in functionsForTests.js)
  // fs = require('fs'),
  { FB_APP_SECRET, tunnelURL, senderID, testPageID } = require('../envVariables'),
  { sessions, findOrCreateSession } = require('../witSessions'),
  { postBackFactory, requestMessageFactory } = require('./functionsForTests');

const expect = chai.expect;
chai.use(chaiHttp);

describe('testing order functionality', function () {
  let dummyRequest;
  this.timeout(8000);

  afterEach(function (done) { setTimeout(done, 4000) });

  it('should store details in conversation context', function () {
    dummyRequest = postBackFactory('ORDER!1/1');

    const myGenHash = crypto.createHmac('sha1', FB_APP_SECRET)
      .update(Buffer.from(JSON.stringify(dummyRequest)))
      .digest('hex');

    return chai.request(tunnelURL)
      .post('/webhook')
      .set("x-hub-signature", `sha1=${myGenHash}`)
      .send(dummyRequest)
      .then(function (res) {
        // this is the request object, not the response we want to be testing
        expect(res).to.have.status(200);
        setTimeout(function () {
          const convoSession = findOrCreateSession(senderID, testPageID);
          expect(sessions[convoSession]).to.contain.key("context");
          console.log("testSession:", sessions[convoSession]);
          console.log("testContext:", sessions[convoSession].context);
          expect(sessions[convoSession].context).to.contain.key("order");
          expect(sessions[convoSession].context.order).to.contain.key("pickuptime");
        }, 2000);
      });
  });

  it('should place an order', function () {
    dummyRequest = requestMessageFactory('10am');

    const myGenHash = crypto.createHmac('sha1', FB_APP_SECRET)
      .update(Buffer.from(JSON.stringify(dummyRequest)))
      .digest('hex');

    return chai.request(tunnelURL)
      .post('/webhook')
      .set("x-hub-signature", `sha1=${myGenHash}`)
      .send(dummyRequest)
      .then(function (res) {
        // this is the request object, not the response we want to be testing
        expect(res).to.have.status(200);
        setTimeout(function () {
          const convoSession = findOrCreateSession(senderID, testPageID);
          expect(sessions[convoSession]).to.contain.key("context");
          expect(sessions[convoSession].context).to.contain.key("pickuptime");
        }, 500);
      });
  });
});
