const chai = require('chai'),
  chaiHttp = require('chai-http'),
  crypto = require('crypto'),
  fs = require('fs'),
  { FB_APP_SECRET, tunnelURL } = require('../index');

const expect = chai.expect;
chai.use(chaiHttp);

describe('checking url response', function() {
  it('pinging base path (/)', function () {
    return chai.request(tunnelURL)
      .get('/')
      .then(function (res) {
        console.log(`res.text = ${res.text}`);
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
      })
  });
});

// NOT WORKING
describe('mock messaging bot from test user', function() {
  it('messaging bot (POST /webhook)', function () {
    const dummyRequest = {
      object: 'page',
      entry: [
        { id: '1766837970261548',
        // time: 1471048736060,
        messaging: [
          {
            sender: { id: '111926652588920' },
            recipient: { id: '1766837970261548' },
            // timestamp: 1471051769301,
            message: {
              mid: 'mid.1471051769294:ccd122d066ed3d7c18',
              seq: 50,
              text: 'you got coffee?'
            }
          }
        ]
        }
      ]
    };
    const myGenHash = crypto.createHmac('sha1', FB_APP_SECRET)
      .update(Buffer.from(JSON.stringify(dummyRequest)))
      .digest('hex');

    chai.request(tunnelURL)
      .post('/webhook')
      .set("x-hub-signature", `sha1=${myGenHash}`)
      .send(dummyRequest)
      .then(function (res) {
        console.log(' --- MUCHO SUCCESSO ---');
        expect(res).to.be.an('object');
        expect(res).to.have.status(200);
      })
  })
});

function writeObject(obj) {
  let wstream = fs.createWriteStream('test/output.json');
  wstream.write(JSON.stringify(obj));
  wstream.on('finish', () => console.log('file is readable in output.json'));
  return wstream.end();
}
