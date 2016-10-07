"use strict";

//global requires
const express = require('express'),
  router = express.Router(),
  passportConf = require('../config/passport');

router.route('/orders')
  .get(passportConf.isAuthenticated, passportConf.isAuthorized, (req, res, next) => {
    console.log('req.params.fbid =', req.params.fbid);
    console.log(req.body);
    res.send('got it');
  })
  .post(passportConf.isAuthenticated, passportConf.isAuthorized, (req, res, next) => {
    console.log('HE TRYNA POST');
    res.send('ur postin 2 me');
  });

module.exports = router;
