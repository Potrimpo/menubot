const chai = require('chai'),
  chaiHttp = require('chai-http'),
    crypto = require('crypto'),
        fs = require('fs'),
  { FB_APP_SECRET, tunnelURL } = require('../envVariables'),
  { requestMessageFactory } = require('./functionsForTests');

const expect = chai.expect;

chai.use(chaiHttp);

// REMEMBER TO CHANGE TUNNELURL ON BOOTUP
describe('checking url response', function() {
  it('pinging base path (/)', function () {
    return chai.request(tunnelURL)
      .get('/')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.have.property('text', 'menubot reporting for duty');
      });
  });

  it('pinging nonexistent path', function () {
    return chai.request(tunnelURL)
      .get('/who-up')
      .then(function (res) {
        return expect(res).to.be.null;
      })
      .catch(function (err) {
        return expect(err).to.have.status(404);
      });
  });
});

describe('sending dummy messages to bot (POST /webhook)', function () {
  let dummyRequest;
  this.timeout(6000);

  afterEach(function (done) { setTimeout(done, 4000) });

  it('should respond positive', function () {
    dummyRequest = requestMessageFactory('do you have tea?');

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

  it('should respond negative', function () {
    dummyRequest = requestMessageFactory('you got coffee?');

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

