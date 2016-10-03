/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const express = require('express'),
  router = express.Router(),
  passportConf = require('../config/passport');

const companyRepo = require('../repositories/CompanyRepository');

router.param('companyId', (req, res, next, id) => {
  console.log("ID PROVIDED =", id);
  req.body.id = id;
  return next();
});

router.get('/:companyId', passportConf.isAuthenticated, passportConf.isAuthorized, (req, res) => {
  console.log("------ getting page -------");
  return getMenu(req.params.companyId)
    .then(data => {
      return res.render('account/company', {
        fbid: data.fbid,
        title: data.name,
        items: data.items,
        types: data.types,
        sizes: data.sizes
      });
    })
});

// can't handle changing photos
router.post('/:companyId', passportConf.isAuthenticated, passportConf.isAuthorized, addItem, (req, res) => {
  console.log("----- POST RECEIVED ------", req.body);
  return res.sendStatus(200);
});

router.get('/create/:companyId', passportConf.isAuthenticated, passportConf.isAuthorized, (req, res) => {
  console.log("----- ADDING COMPANY ------", req.body.id);
  return companyRepo.linkCompany(req.user.id, req.body.id)
    .then(data => {
      return res.redirect(`/company/${data[0].fbid}`)
    });
});

function addItem(req, res, next) {
  console.log(req.body);
  switch (req.body.intent) {
    case "item":
      return companyRepo.insertMenuVal(req.body)
        .then(data => {
          return next();
        });
    case "type":
      return companyRepo.insertType(req.body)
        .then(data => {
          return next();
        });
    case "size":
      return companyRepo.insertSize(req.body)
        .then(() => next());
    case "delete":
      console.log("DELETAIN *********");
      console.log("body = ", req.body);
      return companyRepo.deleteItem(req.body)
        .then(() => next());
    default:
      return console.error("no case for this update intent", req.body.intent);
    }
}

function getMenu (id) {
  return companyRepo.getCompanyMenu(id)
    .then(data => {
      if (!data) throw "no company found";
      if (data.length > 0) return fullMenu(id, data);
      else return companyRepo.findCompany(id)
    })
    .catch(err => console.error("error in getMenu", err.message || err));
}

function fullMenu (fbid, data) {
  const itemids = data.map(val => val.itemid);
  const wholeMenu = {
    name: data[0].name,
    fbid,
    items: data
  };

  return companyRepo.getMenuTypes(itemids)
    .then(types => {
      wholeMenu.types = types;
      const typeids = types.map(val => val.typeid);
      return companyRepo.getMenuSizes(typeids);
    })
    .then(sizes => {
      wholeMenu.sizes = sizes;
      return wholeMenu
    });
}

module.exports = router;
