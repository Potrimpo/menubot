/**
 * Created by lewis.knoxstreader on 2/12/16.
 */
const { findOrCreateSession } = require('../messaging/messengerSessions'),
  runActions = require('../messaging/runActions'),
  postbackHandler = require('../messaging/postbackHandler'),
  actions = require('../messaging/actions');

class Message {
  constructor (event) {
    this.sender = event.sender.id;
    this.recipient = event.recipient.id;

    Object.assign(this, event.message);

    this.postback = event.postback;
  }

  session () {
    return findOrCreateSession(this.sender, this.recipient);
  }

  // parse language if text message, handle postback if not
  process () {
    const x = this.quick_reply || this.postback;
    if (x) {
      return postbackHandler(x.payload, this.sender, this.recipient)
    }
    else if (this.text) {
      return runActions(this.sender, this.recipient, this.text)
    }
  }

  // has to deal with JavaScript's terribad type system in order to figure out how to respond
  reply (message) {
    if (typeof message === 'string') {
      return actions.send(this.sender, {text: message});
    }

    else if (Array.isArray(message)) {
      return Promise.all(
        message.map(msg => actions.send(this.sender, { text: msg }))
      );
    }

    else {
      return actions.send(this.sender, message);
    }
  }
}

module.exports = Message;