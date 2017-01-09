const Message = require('../classes/Message');

exports.postWebhook = (req, res) => {
  const data = req.body;

  if (data.object === 'page') {
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        const msg = new Message(event);

        return msg
          .session()
          .then(() => msg.process())
          .catch(err => console.error("error processing message:", err));
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
