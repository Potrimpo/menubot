const chai = require('chai'),
  chaiHttp = require('chai-http'),
  crypto = require('crypto'),
  { FB_APP_SECRET, tunnelURL } = require('../index');

const expect = chai.expect;
chai.use(chaiHttp);

describe('integration & use case tests', function() {
  it('pinging base path (/)', function () {
    chai.request(tunnelURL)
      .get('/')
      .then(function (res) {
        console.log(res);
        expect(res).to.have.status(200);
      });
  });

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
        console.log(res.body);
        console.log(`res.body ^^`);
        expect(res).to.have.status(200);
      })
  })
});
