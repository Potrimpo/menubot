'use strict';

const bodyParser = require('body-parser'),
  express = require('express'),
  request = require('request'),
  crypto = require('crypto'),
  mongoose = require('mongoose');

const { Wit, log } = require('./index'),
  { PORT, mongooseURL, WIT_TOKEN, FB_APP_SECRET, FB_VERIFY_TOKEN } = require('./envVariables'),
  { sessions, findOrCreateSession } = require('./witSessions'),
  actions = require('./actions'),
  postbackHandler = require('./messaging/sending-menu'),
  fbMessage = require('./messenger');

console.log(`/webhook is accepting Verify Token: "${FB_VERIFY_TOKEN}"`);

// Setting up our bot
const wit = new Wit({
  accessToken: WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});

// Setting up mongodb server
mongoose.connect(mongooseURL);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('mongodb connected');
});

// Starting our webserver and putting it all together
const app = express();
app.use(({method, url}, rsp, next) => {
  rsp.on('finish', () => {
    console.log(`${rsp.statusCode} ${method} ${url}`);
  });
  next();
});
app.use(bodyParser.json({ verify: verifyRequestSignature }));

// Home page as insurance
app.get('/', function(req, res) {
  res.send("menubot reporting for duty");
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
app.post('/webhook', (req, res) => {
  // Parse the Messenger payload
  // See the Webhook reference
  // https://developers.facebook.com/docs/messenger-platform/webhook-reference
  const data = req.body;

  if (data.object === 'page') {
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message) {
          // Yay! We got a new message!
          // We retrieve the Facebook user ID of the sender
          const sender = event.sender.id;
          // console.log(`sender ID: ${sender}`);
          // We retrieve the user's current session, or create one if it doesn't exist
          // This is needed for our bot to figure out the conversation history
          const sessionId = findOrCreateSession(event.sender.id, event.recipient.id);
          // We retrieve the message content
          const {text, attachments} = event.message;

          if (attachments) {
            // We received an attachment
            // Let's reply with an automatic message
            fbMessage(sender, 'Sorry I can only process text messages for now.')
            .catch(console.error);
          } else if (text) {
            // We received a text message

            // Let's forward the message to the Wit.ai Bot Engine
            // This will run all actions until our bot has nothing left to do
            wit.runActions(
              sessionId, // the user's current session
              text, // the user's message
              sessions[sessionId].context // the user's current session state
            ).then((context) => {
              // Our bot did everything it has to do.
              // Now it's waiting for further messages to proceed.
              console.log('Waiting for next user messages');

              // Based on the session state, you might want to reset the session.
              // This depends heavily on the business logic of your bot.
              // Example:
              // if (context['done']) {
              //   delete sessions[sessionId];
              // }

              // Updating the user's current session state
              sessions[sessionId].context = context;
            })
            .catch((err) => {
              console.error('Oops! Got an error from Wit: ', err.stack || err);
            })
          }
        } else if(event.postback) {
          const sessionId = findOrCreateSession(event.sender.id, event.recipient.id);
          console.log(`event.sender.id = ${event.sender.id}`);
          console.log(`event.recipient.id = ${event.recipient.id}`);
          postbackHandler(event.postback.payload, sessions[sessionId].fbPageId)
            .then(response => {
              actions.send({sessionId}, response)
            })
            .catch(err => {
              console.log(`Error dealing with postbackHandler: ${err}`);
              console.log(err.stack);
            });
        } else {
          console.log('received event', JSON.stringify(event));
        }
      });
    });
  }
  res.sendStatus(200);
});

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

app.listen(PORT);
console.log('Listening on :' + PORT + '...');

module.exports = app;