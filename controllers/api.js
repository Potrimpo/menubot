"use strict";

const express = require('express'),
  router = express.Router(),
  fetch = require('node-fetch'),
  { retrieveOrders, setOrderComplete } = require('./orders'),
  { findCompany, setBotStatus } = require('../repositories/CompanyRepository');


// absolute path is /api/orders/:fbid
router.route('/orders/:fbid')
  .get(retrieveOrders, (req, res) => {
    return res.json(req.orders);
  })
  .post(setOrderComplete, (req, res) => {
    return res.send('ur postin 2 me & i think it done worked');
  });

router.route('/activate/:fbid')
  .get((req, res) => {
    return findCompany(req.params.fbid)
      .then(data => activateBot(data.access_token))
      .then(() => setBotStatus(req.params.fbid, true))
      .then(() => res.redirect('/'));
  });

function activateBot(pageToken) {
  return subscribeToWebhook(pageToken)
    .then(() => initializePersistentMenu(pageToken))
}

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
        url: "LOCATION",
      }
    ]
  };
  pageToken = encodeURIComponent((pageToken));
  const url = `https://graph.facebook.com/me/thread_settings?access_token=${pageToken}`;
  return fetch(url, {
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
}

module.exports = router;
