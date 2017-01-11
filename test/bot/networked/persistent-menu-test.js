const chai = require('chai'),
  chaiHttp = require('chai-http'),
  { tunnelURL } = require('../../envVariables'),
  { postBackFactory, hashMyMessage } = require('./functionsForTests');

const expect = chai.expect;
chai.use(chaiHttp);

describe('simulated persistent menu requests (type postback)', function () {
  this.timeout(6000);

  afterEach(function (done) { setTimeout(done, 4000) });

  it('should be in the middle of nowhere', function () {
    const dummyRequest = postBackFactory('LOCATION');
    const myGenHash = hashMyMessage(dummyRequest);

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
    const dummyRequest = postBackFactory('MENU');
    const myGenHash = hashMyMessage(dummyRequest);

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

  it("simulated pressing 'get started' button", function () {
    const dummyRequest = postBackFactory('GET_STARTED');
    const myGenHash = hashMyMessage(dummyRequest);

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

