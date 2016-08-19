const chai = require('chai'),
  chaiHttp = require('chai-http'),
    // fs for debugging using writeToFile (in functionsForTests.js)
    fs = require('fs'),
  { tunnelURL } = require('../envVariables');

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

