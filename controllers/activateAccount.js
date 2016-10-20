/**
 * Created by lewis.knoxstreader on 19/10/16.
 */
const fetch = require('node-fetch');

exports.activateBot = pageToken => {
  return subscribeToWebhook(pageToken)
    .then(() => initializePersistentMenu(pageToken))
    .then(() => setupGreetingText(pageToken))
};

function subscribeToWebhook (pageToken) {
  pageToken = encodeURIComponent((pageToken));
  const body = `access_token=${pageToken}`;
  const query = `https://graph.facebook.com/me/subscribed_apps`;
  return fetch(query, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      return json;
    })
    .catch(err => console.error("error activating bot for this page!!", err));
}

function initializePersistentMenu (pageToken) {
  const body = {
    setting_type: "call_to_actions",
    thread_state: "existing_thread",
    call_to_actions:[
      {
        type: "postback",
        title: "Menu",
        payload: "MENU"
      },
      {
        type: "postback",
        title: "My Orders",
        payload: "MY_ORDERS"
      },
      {
        type: "postback",
        title: "Location",
        payload: "LOCATION",
      }
    ]
  };
  pageToken = encodeURIComponent((pageToken));
  const url = `https://graph.facebook.com/me/thread_settings?access_token=${pageToken}`;
  return fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      return json;
    })
}

function setupGreetingText (pageToken) {
  const body = {
    setting_type: "greeting",
    greeting: {
      text: "This is a menu.bot activated page"
    }
  };
  console.log("SETUP GREETING TEXT", body);
  pageToken = encodeURIComponent((pageToken));
  const url = `https://graph.facebook.com/me/thread_settings?access_token=${pageToken}`;
  return fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      return json;
    })
}
