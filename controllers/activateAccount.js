/**
 * Created by lewis.knoxstreader on 19/10/16.
 */
const fetch = require('node-fetch');

exports.activateBot = pageToken => {
  console.log("Activating messenger bot");

  return webhookSubscription(pageToken, true)
    .then(() => getStartedButton(pageToken, true))
    .then(() => greetingText(pageToken, true))
    .then(() => persistentMenu(pageToken, true))
};

exports.deactivateBot = pageToken => {
  console.log("Deactivating messenger bot");

  return persistentMenu(pageToken, false)
    .then(() => getStartedButton(pageToken, false))
    .then(() => greetingText(pageToken, false))
    .then(() => webhookSubscription(pageToken, false))
};

function webhookSubscription (pageToken, intent) {
  pageToken = encodeURIComponent((pageToken));
  const body = `access_token=${pageToken}`;
  const query = `https://graph.facebook.com/me/subscribed_apps`;
  return fetch(query, {
    method: intent ? 'POST' : 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      console.log("Response to webhook subscription request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error activating bot for this page!!", err));
}

function persistentMenu (pageToken, intent) {
  const body = {
    setting_type: "call_to_actions",
    thread_state: "existing_thread",
  };
  if (intent) {
    body.call_to_actions = [
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
    ];
  }
  pageToken = encodeURIComponent((pageToken));
  const url = `https://graph.facebook.com/me/thread_settings?access_token=${pageToken}`;
  return fetch(url, {
    method: intent ? 'POST' : 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      console.log("Response to persistent menu setting request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error initializing persistent menu!!", err));
}

function greetingText (pageToken, intent) {
  const body = {
    setting_type: "greeting",
  };
  if (intent) {
    body.greeting = {
      text: "This is a Menubot.xyz activated page. View the menu and order ahead of time, straight from Facebook messenger."
    }
  }
  pageToken = encodeURIComponent((pageToken));
  const url = `https://graph.facebook.com/me/thread_settings?access_token=${pageToken}`;
  return fetch(url, {
    method: intent ? 'POST' : 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      console.log("Response to greeting text setting request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error setting greeting text!!", err));
}

function getStartedButton (pageToken, intent) {
  const body = {
    setting_type: "call_to_actions",
    thread_state: "new_thread"
  };
  if (intent) {
    body.call_to_actions = [
      {
        payload: JSON.stringify({ intent: "GET_STARTED" })
      }
    ];
  }
  pageToken = encodeURIComponent((pageToken));
  const url = `https://graph.facebook.com/me/thread_settings?access_token=${pageToken}`;
  return fetch(url, {
    method: intent ?'POST' : 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      console.log("Response to Get Started btn setting request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error adding get-started button!!", err));
}
