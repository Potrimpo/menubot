/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const express = require('express'),
  router = express.Router();

const companyRepo = require('../repositories/CompanyRepository');

// router.param('companyId', (req, res, next, id) => {
//   console.log("ID PROVIDED =", id);
//   console.log("POST RECEIVED", req.data);
// });

router.get('/:companyId', (req, res) => {
  return getMenu(req)
    .then(data => {
      return res.render('account/company', {
        fbid: data.fbid,
        title: data.company,
        items: data.items,
        types: data.types,
        sizes: data.sizes
      });
    })
});

router.post('/:companyId', (req, res) => {
  console.log("POST RECEIVED", req.body);
  return res.sendStatus(200);
});

function getMenu (req) {
  return companyRepo.getCompanyMenu(req.params.companyId)
    .then(data => {
      if (!data) throw "no company found";
      req.company = data[0].name;
      req.fbid = req.params.companyId;
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
      return req;
    })
}

module.exports = router;
