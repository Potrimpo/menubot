const fetch = require('node-fetch'),
  { FB_PAGE_TOKEN } = require('./envVariables');

// ----------------------------------------------------------------------------
// Messenger API specific code
// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference

const fbMessage = (id, text, quick_replies) => {
  const body = JSON.stringify({
    recipient: { id },
    message: { text, quick_replies },
  });
  console.log(body);

  const qs = 'access_token=' + encodeURIComponent(FB_PAGE_TOKEN);
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
    });
};

module.exports = fbMessage;
