/**
 * Created by lewis.knoxstreader on 19/10/16.
 */
const fetch = require('node-fetch');

exports.activateBot = pageToken => {
  console.log("Activating messenger bot")

  return subscribeToWebhook(pageToken)
    .then(() => getStartedButton(pageToken))
    .then(() => setupGreetingText(pageToken))
    .then(() => initializePersistentMenu(pageToken))
};

exports.deactivateBot = pageToken => {
  console.log("Deactivating messenger bot");

  return removePersistentMenu(pageToken)
    .then(() => removeGetStartedButton(pageToken))
    .then(() => removeGreetingText(pageToken))
    .then(() => unsubscribeToWebhook(pageToken))
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
      console.log("Response to webhook subscription request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error activating bot for this page!!", err));
};

function unsubscribeToWebhook (pageToken) {
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
      console.log("Response to webhook unsubscription request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error deactivating bot for this page!!", err));
};



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
      console.log("Response to persistent menu setting request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error initializing persistent menu!!", err));
};

function removePersistentMenu (pageToken) {
  const body = {
    "setting_type":"call_to_actions",
    "thread_state":"existing_thread"
  };
  pageToken = encodeURIComponent((pageToken));
  const url = `https://graph.facebook.com/me/thread_settings?access_token=${pageToken}`;
  return fetch (url, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      console.log("Response to persistent menu removal request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error initializing persistent menu!!", err));
};



function setupGreetingText (pageToken) {
  const body = {
    setting_type: "greeting",
    greeting: {
      text: "This is a Menubot.xyz activated page. View the menu and order ahead of time, straight from Facebook messenger."
    }
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
      console.log("Response to greeting text setting request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error setting greeting text!!", err));
};

function removeGreetingText (pageToken) {
  const body = {
    setting_type: "greeting"
  };
  pageToken = encodeURIComponent((pageToken));
  const url = `https://graph.facebook.com/me/thread_settings?access_token=${pageToken}`;
  return fetch(url, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      console.log("Response to greeting text removal request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error setting greeting text!!", err));
};



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
      console.log("Response to Get Started btn setting request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error adding get-started button!!", err));
}

function removeGetStartedButton (pageToken) {
  const body = {
    setting_type: "call_to_actions",
    thread_state: "new_thread"
  };
  pageToken = encodeURIComponent((pageToken));
  const url = `https://graph.facebook.com/me/thread_settings?access_token=${pageToken}`;
  return fetch(url, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      console.log("Response to Get Started btn removal request: " + JSON.stringify(json));
      return json;
    })
    .catch(err => console.error("error adding get-started button!!", err));
}
