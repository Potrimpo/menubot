'use strict';

const bodyParser = require('body-parser'),
  express = require('express'),
  request = require('request'),
  crypto = require('crypto');

const { PORT, FB_APP_SECRET, FB_VERIFY_TOKEN } = require('./envVariables'),
  { postWebhook } = require('./controllers/postWebhook');

// console.log(`/webhook is accepting Verify Token: "${FB_VERIFY_TOKEN}"`);

// Starting our webserver and putting it all together
const app = express();
app.use(({method, url}, rsp, next) => {
  rsp.on('finish', () => {
    console.log(`${rsp.statusCode} ${method} ${url}`);
  });
  next();
});
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use('/static', express.static(__dirname + '/public'));

// Home page as insurance
app.get('/', function(req, res) {
  res.send('menubot reporting for duty');
});


// Webhook setup (facebook pings this with heartbeat)
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    console.log(`query is ${JSON.stringify(req.query)}`);
    res.sendStatus(400);
  }
});

// Message handler
app.post('/webhook', postWebhook);

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    // console.log(`signature: ${signature}`);
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      console.log(`signatureHash: ${signatureHash}`);
      console.log(`expectedHash: ${expectedHash}`);
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

const { sequelize } = require('./database');

sequelize.sync({ force: false })
  .then(() => {
    console.log("sequelize is synced");
    app.listen(PORT);
    console.log('Listening on :' + PORT + '...');
  })
  .catch(err => console.error("error syncing sequelize db", err.message || err));


module.exports = app;