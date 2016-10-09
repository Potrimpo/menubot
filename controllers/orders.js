/**
 * Created by lewis.knoxstreader on 3/10/16.
 */

const express = require('express'),
  router = express.Router(),
  passportConf = require('../config/passport');

router.get('/:fbid', passportConf.isAuthenticated, passportConf.isAuthorized, (req, res) => {
  console.log("fbid for order page =", req.params.fbid);
  return res.render('orders/orders', { title: 'Orders' });
});

module.exports = router;
exports.retrieveOrders = (req, res, next) => {
  return getOrders(req.params.fbid)
    .then(data => {
      req.orders = data;
      return next();
    })
    .catch(err => res.status(500).send('error getting orders'));
};
