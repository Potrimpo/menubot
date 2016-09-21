/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const express = require('express'),
  router = express.Router();

const companyRepo = require('../repositories/CompanyRepository');

router.param('companyId', (req, res, next, id) => {
  return companyRepo.getCompanyMenu(id)
    .then(data => {
      if (!data) throw "no company found";
      req.company = data[0].name;
      req.fbid = id;
      req.items = data;
      const itemids = data.map(val => val.itemid);
      return companyRepo.getMenuTypes(itemids);
    })
    .then(data => {
      console.log("TYPES =", data);
      req.types = data;
      const typeids = data.map(val => val.typeid);
      return companyRepo.getMenuSizes(typeids);
    })
    .then(data => {
      console.log("SIZES =", data);
      req.sizes = data;
      return next();
    })
});

router.get('/:companyId', (req, res) => {
  return res.render('account/company', {
    fbid: req.fbid,
    title: req.company,
    items: req.items,
    types: req.types,
    sizes: req.sizes
  });
});

module.exports = router;
