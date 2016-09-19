const chai = require('chai'),
  chaiHttp = require('chai-http'),
  // fs for debugging using writeToFile (in functionsForTests.js)
  fs = require('fs'),
  { tunnelURL } = require('../../envVariables'),
  { postBackFactory, hashMyMessage } = require('./functionsForTests');

const expect = chai.expect;
chai.use(chaiHttp);

describe('simulated persistent menu requests (type postback)', function () {
  let dummyRequest,
      myGenHash;
  this.timeout(6000);

  afterEach(function (done) { setTimeout(done, 4000) });

  it('should be in the middle of nowhere', function () {
    dummyRequest = postBackFactory('LOCATION');
    myGenHash = hashMyMessage(dummyRequest);

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
    myGenHash = hashMyMessage(dummyRequest);

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

