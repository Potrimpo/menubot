const { findOrCreateSession, redisDeleteOrder } = require('../state-and-sessions/messengerSessions'),
  runActions = require('../messaging/response-logic/runActions'),
  postbackHandler = require('../messaging/response-logic/postbackHandler'),
  actions = require('../messaging/response-logic/actions'),
  db = require('../repositories/bot/botQueries.js');

class Message {
  constructor (event) {
    this.sender = event.sender.id;
    this.recipient = event.recipient.id;
    this.timestamp = event.timestamp;

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
      return postbackHandler(x.payload, this.sender, this.recipient, this.timestamp)
        .then(resp => this.reply(resp));
    }
    else if (this.text) {
      return db.getTimezone(this.recipient)
        .then(data => runActions(this.sender, this.recipient, this.text, this.timestamp, data.timezone))
        // .then(resp => this.reply(resp))
        .then(resp => this.reply(resp))
        .then(() => redisDeleteOrder(this.sender))
        .catch(err => this.reply(err));
    }
  }

  // has to deal with JavaScript's terribad type system in order to figure out how to respond
  reply (message) {
    if (typeof message === 'string') {
      return actions.send(this.sender, { text: message });
    }

    else if (Array.isArray(message)) {
      return Promise.all(
        message.map(msg => actions.send(this.sender, msg)));
    }

    else {
      return actions.send(this.sender, message);
    }
  }
}

module.exports = Message;
