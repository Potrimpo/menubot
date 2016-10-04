/**
 * Created by lewis.knoxstreader on 3/10/16.
 */

const express = require('express'),
  router = express.Router(),
  passportConf = require('../config/passport');

router.get('/:fbid', (req, res) => {
  console.log("fbid for order page =", req.params.fbid);
  return res.render('orders/orders', { title: 'Orders' });
});

module.exports = router;
