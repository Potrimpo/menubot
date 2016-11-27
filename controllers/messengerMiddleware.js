/**
 * Created by lewis.knoxstreader on 18/09/16.
 */

const { findOrCreateSession, redisDeleteOrder } = require('../messaging/messengerSessions'),
  runActions = require('../messaging/runActions'),
  postbackHandler = require('../messaging/postbackHandler'),
  actions = require('../messaging/actions');

exports.postWebhook = (req, res) => {
  const data = req.body;

  if (data.object === 'page') {
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {

        if (event.message) {
          // Received message
          // We retrieve the user's current session, or create one if it doesn't exist
          // This is needed for our bot to figure out the conversation history
          return findOrCreateSession(event.sender.id, event.recipient.id)
            .then(userID => {
              const { text, attatchments, quick_reply } = event.message;

              if (attatchments) {
                // bot currently does not process images, video, or audio messages
                return actions.send(userID, {text: 'Sorry, I can only handle text messages!'});
              }

              else if (quick_reply) {
                return postbackHandler(quick_reply.payload, event.sender.id, event.recipient.id)
                  .then(response => actions.send(userID, response))
                  .catch(err => console.error("Error sending postback:", err));
              }

              else if (text) {
                return runActions(userID, event.recipient.id, text)
                  .then(responses => Promise.all(
                    responses.map(val => actions.send(userID, { text: val }))
                  ))
                  .then(() => redisDeleteOrder(userID))
                  .catch(err => {
                    console.log("err sending", err);
                    return actions.send(userID, { text: err })
                  });
              }

            })
            .then(() => {
              // Our bot did everything it has to do.
              // Now it's waiting for further messages to proceed.
              console.log('Waiting for next user messages');
            })
            .catch((err) => {
              console.error('Oops! Got an error dealing with this message: ', err.stack || err);
            });
        }

        else if (event.postback) {
          return findOrCreateSession(event.sender.id, event.recipient.id)
            .then(sessionId => {
              return postbackHandler(event.postback.payload, event.sender.id, event.recipient.id)
                .then(response => actions.send(sessionId, response))
                .catch(err => console.error("Error sending postback:", err));
            })
        }

      });
    });
  }

  return res.sendStatus(200);
};

exports.getWebhook = (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === process.env.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    console.log(`query is ${JSON.stringify(req.query)}`);
    res.sendStatus(400);
  }
};
