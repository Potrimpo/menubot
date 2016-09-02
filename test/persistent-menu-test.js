const chai = require('chai'),
  chaiHttp = require('chai-http'),
  crypto = require('crypto'),
  // fs for debugging using writeToFile (in functionsForTests.js)
  fs = require('fs'),
  { FB_APP_SECRET, tunnelURL } = require('../envVariables'),
  { postBackFactory } = require('./functionsForTests');

const expect = chai.expect;
chai.use(chaiHttp);

describe('simulated persistent menu requests (type postback)', function () {
  let dummyRequest;
  this.timeout(6000);

  afterEach(function (done) { setTimeout(done, 4000) });

  it('should be in the middle of nowhere', function () {
    dummyRequest = postBackFactory('LOCATION');

    const myGenHash = crypto.createHmac('sha1', FB_APP_SECRET)
      .update(Buffer.from(JSON.stringify(dummyRequest)))
      .digest('hex');

    return chai.request(tunnelURL)
      .post('/webhook')
      .set("x-hub-signature", `sha1=${myGenHash}`)
      .send(dummyRequest)
      .then(function (res) {
        // this is the request object, not the response we want to be testing
        expect(res).to.be.an('object');
        expect(res).to.have.status(200);
      });
  });

  it('should fetch menu (but not details)', function () {
    dummyRequest = postBackFactory('MENU');

    const myGenHash = crypto.createHmac('sha1', FB_APP_SECRET)
      .update(Buffer.from(JSON.stringify(dummyRequest)))
      .digest('hex');

    return chai.request(tunnelURL)
      .post('/webhook')
      .set("x-hub-signature", `sha1=${myGenHash}`)
      .send(dummyRequest)
      .then(function (res) {
        // this is the request object, not the response we want to be testing
        expect(res).to.be.an('object');
        expect(res).to.have.status(200);
      });
  });
});

