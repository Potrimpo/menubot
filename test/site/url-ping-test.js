const chai = require('chai'),
  chaiHttp = require('chai-http'),
    // fs for debugging using writeToFile (in helper-functions.js)
    fs = require('fs'),
  { tunnelURL } = require('../envVariables');

const expect = chai.expect;

chai.use(chaiHttp);

// REMEMBER TO CHANGE TUNNELURL ON BOOTUP
describe('checking url response', function() {
  it('pinging base path (/landing)', function () {
    return chai.request(tunnelURL)
      .get('/landing')
      .then(function (res) {
        expect(res).to.have.status(200);
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

