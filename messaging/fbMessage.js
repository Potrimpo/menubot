const fetch = require('node-fetch');

// ----------------------------------------------------------------------------
// Messenger API specific code
// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference

const fbMessage = (id, token, message) => {
  const body = JSON.stringify({
    recipient: { id },
    message
  });

  const qs = 'access_token=' + encodeURIComponent(token);
  return fetch('https://graph.facebook.com/me/messages?' + qs, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body,
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      return json;
    })
    .catch(err => console.error("error sending message", err));
};

module.exports = fbMessage;
