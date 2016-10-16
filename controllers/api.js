"use strict";

const express = require('express'),
  router = express.Router(),
  { retrieveOrders, setOrderComplete } = require('./orders');


// absolute path is /api/orders/:fbid
router.route('/orders/:fbid')
  .get(retrieveOrders, (req, res) => {
    return res.json(req.orders);
  })
  .post(setOrderComplete, (req, res) => {
    return res.send('ur postin 2 me & i think it done worked');
  });

module.exports = router;
