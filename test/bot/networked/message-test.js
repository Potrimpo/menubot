const chai = require('chai'),
  chaiHttp = require('chai-http'),
  Identity = require('ramda-fantasy').Identity,
  { tunnelURL } = require('../../../config/local-dev-variables'),
  { requestMessageFactory, hashMyMessage } = require('../functionsForTests');

const expect = chai.expect;
chai.use(chaiHttp);

describe('sending dummy messages to bot (POST /webhook)', function () {
 this.timeout(6000);

 afterEach(function (done) { setTimeout(done, 3000) });

 it('should get POST 200', function () {
   const val = msgAndHash('you got bikes?');

   return chai.request(tunnelURL)
     .post('/webhook')
     .set("x-hub-signature", `sha1=${val.hash}`)
     .send(val.msg)
     .then(function (res) {
       // this is the request object, not the response we want to be testing
       expect(res).to.be.an('object');
       expect(res).to.have.status(200);
     });
 });
});

const msgAndHash = str =>
  Identity(str)
    .map(requestMessageFactory)
    .map(msg ({
      msg,
      hash: hashMyMessage(msg)
    }))
    .get();