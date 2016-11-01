/**
 * Created by lewis.knoxstreader on 18/09/16.
 */

const { FB_VERIFY_TOKEN } = require('../envVariables'),
  { sessions, findOrCreateSession } = require('../messengerSessions'),
  runActions = require('../messaging/runActions'),
  postbackHandler = require('../messaging/sending-menu'),
  actions = require('../messaging/actions'),
  fbMessage = require('../messaging/messenger');

exports.postWebhook = (req, res) => {
  // Parse the Messenger payload
  // See the Webhook reference
  // https://developers.facebook.com/docs/messenger-platform/webhook-reference
  const data = req.body;

  if (data.object === 'page') {
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        console.log("sender id ==", event.sender.id);
        if (event.message) {
          // Yay! We got a new message!
          // We retrieve the Facebook user ID of the sender
          let outerSession = {};
          // console.log(`sender ID: ${sender}`);
          // We retrieve the user's current session, or create one if it doesn't exist
          // This is needed for our bot to figure out the conversation history
          return findOrCreateSession(event.sender.id, event.recipient.id)
            .then(sessionId => {
              outerSession = sessionId;
              const { text, attatchments, quick_reply } = event.message;
              // Let's forward the message to the Wit.ai Bot Engine
              // This will run all actions until our bot has nothing left to do
              if (attatchments) {
                return actions.send({sessionId}, {text: 'Sorry, I can only handle text messages!'});
              }
              else if (quick_reply) {
                return postbackHandler(quick_reply.payload, sessions[sessionId])
                  .then(response => {
                    actions.send({sessionId}, response)
                  })
                  .catch(err => {
                    console.log(`Error sending postback: ${err}`);
                    console.log(err.stack);
                  });
              }
              else if (text) {
                console.log("EVENT.MESSAGE =====", event.message);
                console.log("Session: messengerMiddleware", sessions[sessionId]);
                console.log("all sessions: messengerMiddleware", sessions);
                return runActions(
                  sessionId,
                  text,
                  sessions[sessionId].context
                );
              }
            })
            .then((context) => {
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
                sessions[outerSession].context = context;
              })
              .catch((err) => {
                console.error('Oops! Got an error dealing with this message: ', err.stack || err);
              });
        } else if(event.postback) {
          console.log("sender =", event.sender.id);
          console.log("recipient =", event.recipient.id);
          return findOrCreateSession(event.sender.id, event.recipient.id)
            .then(sessionId => {
              return postbackHandler(event.postback.payload, sessions[sessionId])
                .then(response => {
                  actions.send({sessionId}, response)
                })
                .catch(err => {
                  console.log(`Error sending postback: ${err}`);
                  console.log(err.stack);
                });
            })
        } else {
          console.log('received event', JSON.stringify(event));
        }
      });
    });
  }
  res.sendStatus(200);
};

exports.getWebhook = (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    console.log(`query is ${JSON.stringify(req.query)}`);
    res.sendStatus(400);
  }
};

