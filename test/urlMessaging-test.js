const chai = require('chai'),
  chaiHttp = require('chai-http'),
    crypto = require('crypto'),
        fs = require('fs'),
  { FB_APP_SECRET, tunnelURL } = require('../index');

const senderID = '1383034061711690',
        expect = chai.expect;

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
  function requestFactory (text) {
    return {
      object: 'page',
      entry: [
        { id: '1766837970261548',
          messaging: [
            {
              sender: { id: senderID },
              recipient: { id: '1766837970261548' },
              message: {
                mid: 'mid.1471051769294:ccd122d066ed3d7c18',
                seq: 50,
                text
              }
            }
          ]
        }
      ]
    };
  }

  it('should respond positive', function () {
    dummyRequest = requestFactory('do you have coffee?');

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
    dummyRequest = requestFactory('you got tea?');

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


function writeObject(obj) {
  let wstream = fs.createWriteStream('test/output.json');
  wstream.write(JSON.stringify(obj));
  wstream.on('finish', () => console.log('file is readable in output.json'));
  return wstream.end();
}
