/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const express = require('express'),
  router = express.Router();

const companyRepo = require('../repositories/CompanyRepository');

router.param('companyId', (req, res, next, id) => {
  return companyRepo.getCompanyAndItems(id)
    .then(data => {
      if (!data) throw "no company found";
      console.log("DATA FROM COMPANY QUERY", data);
      req.company = data;
      req.fbid = id;
      return next();
    });
});

router.get('/:companyId', (req, res) => {
  return res.render('company', { title: req.company[0].name, items: req.company, fbid: req.fbid });
});

module.exports = router;
