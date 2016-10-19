"use strict";

const express = require('express'),
  router = express.Router(),
  fetch = require('node-fetch'),
  { retrieveOrders, setOrderComplete } = require('./orders'),
  { findCompany, setBotStatus } = require('../repositories/CompanyRepository'),
  { activateBot } = require('./activateAccount');


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

module.exports = router;
