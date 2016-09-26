/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const express = require('express'),
  router = express.Router();

const companyRepo = require('../repositories/CompanyRepository');

router.param('companyId', (req, res, next, id) => {
  console.log("ID PROVIDED =", id);
  return next();
});

router.get('/:companyId', (req, res) => {
  console.log("------ getting page -------");
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

// can't handle changing photos
router.post('/:companyId', addItem, (req, res) => {
  console.log("----- POST RECEIVED ------", req.body);
  return res.sendStatus(200);
});

function addItem(req, res, next) {
  console.log("ADDING ITEM");
  console.log(req.body);
  return companyRepo.insertMenuVal(req.body.fbid, req.body.sendData)
    .then(data => {
      console.log("DATA FROM DB INSERTION", data);
      return next();
    });
}

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
