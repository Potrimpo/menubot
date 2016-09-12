const chai = require('chai'),
  chaiHttp = require('chai-http'),
  // fs for debugging using writeToFile (in functionsForTests.js)
  fs = require('fs'),
  { tunnelURL } = require('../envVariables'),
  { requestMessageFactory, hashMyMessage } = require('./functionsForTests');

const expect = chai.expect;
chai.use(chaiHttp);

describe('sending dummy messages to bot (POST /webhook)', function () {
 let dummyRequest;
 this.timeout(6000);

 afterEach(function (done) { setTimeout(done, 4000) });

 it('should respond positive', function () {
   dummyRequest = requestMessageFactory('do you have coffee?');
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

 it('should respond negative', function () {
   dummyRequest = requestMessageFactory('you got bikes?');
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
