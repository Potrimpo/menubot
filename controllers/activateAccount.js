/**
 * Created by lewis.knoxstreader on 19/10/16.
 */
const fetch = require('node-fetch');

exports.activateBot = pageToken => {
  return subscribeToWebhook(pageToken)
    .then(() => getStartedButton(pageToken))
    .then(() => setupGreetingText(pageToken))
    .then(() => initializePersistentMenu(pageToken))
};

exports.deactivateBot = pageToken => {
  pageToken = encodeURIComponent((pageToken));
  const body = `access_token=${pageToken}`;
  const query = `https://graph.facebook.com/me/subscribed_apps`;
  return fetch(query, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      console.log(json);
      return json;
    })
    .catch(err => console.error("error deactivating bot for this page!!", err));
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
      console.log(json);
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
        payload: JSON.stringify({ intent: "MENU" })
      },
      {
        type: "postback",
        title: "My Orders",
        payload: JSON.stringify({ intent: "MY_ORDERS" })
      },
      {
        type: "postback",
        title: "Location",
        payload: JSON.stringify({ intent: "LOCATION" })
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
      console.log(json);
      return json;
    })
    .catch(err => console.error("error initializing persistent menu!!", err));
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
      console.log(json);
      return json;
    })
    .catch(err => console.error("error setting greeting text!!", err));
}

function getStartedButton (pageToken) {
  const body = {
    setting_type: "call_to_actions",
    thread_state: "new_thread",
    call_to_actions: [
      {
        payload: JSON.stringify({ intent: "GET_STARTED" })
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
      console.log(json);
      return json;
    })
    .catch(err => console.error("error adding get-started button!!", err));
}
