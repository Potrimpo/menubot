"use strict";

const express = require('express'),
  router = express.Router(),
  { retrieveOrders } = require('./orders');


// absolute path is /api/orders/:fbid
router.route('/orders/:fbid')
  .get(retrieveOrders, (req, res) => {
    console.log('Getting orders through API', req.params.fbid);
    console.log('orders retreived:', req.orders);
    return res.status(200).send("got it broski");
  })
  .post((req, res) => {
    console.log('HE TRYNA POST');
    res.send('ur postin 2 me');
  });

module.exports = router;
