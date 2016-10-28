/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const express = require('express'),
  router = express.Router();

const companyRepo = require('../repositories/site/CompanyRepository');

router.param('companyId', (req, res, next, id) => {
  console.log("ID PROVIDED =", id);
  req.body.id = id;
  return next();
});

router.get('/:companyId', (req, res) => {
  console.log("------ getting company menu -------", req.params.companyId);
  return getMenu(req.params.companyId)
    .then(data => {
      console.log("This is the object being passed to the .ejs files: " + JSON.stringify(data));
      return res.render('account/company', {
        fbid: data.fbid,
        title: data.name,
        items: data.items,
        types: data.types,
        sizes: data.sizes
      });
    })
});

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

      //If there aren't any types, doesn't ask the database to produce the sizes related to the (non-existant) types
      if (typeids.length !== 0) {
        console.log("running getMenuSizes");
        return companyRepo.getMenuSizes(typeids)
      } else {
        console.log("running resolved promise");
        return Promise.resolve([])
      }
    })
    .then(sizes => {
      wholeMenu.sizes = sizes;
      return wholeMenu
    });
}



// can't handle changing photos
router.post('/:companyId', add_to_menu, (req, res) => {
  console.log("----- POST RECEIVED ------", req.body);
  return res.sendStatus(200);
});

router.get('/create/:companyId', (req, res) => {
  console.log("----- ADDING COMPANY ------", req.body.id);
  return companyRepo.linkCompany(req.user.id, req.body.id)
    .then(data => {
      return res.redirect(`/company/${data[0].fbid}`)
    });
});

function add_to_menu(req, res, next) {
  console.log(req.body);
  switch (req.body.intent) {
    case "item":
      return companyRepo.insertMenuVal(req.body)
        .then(next());
    case "type":
      return companyRepo.deleteItemPrice(req.body)
        .then(companyRepo.insertType(req.body))
        .then(next());

    case "size":
      return companyRepo.deleteTypePrice(req.body)
        .then(companyRepo.insertSize(req.body))
        .then(next());

    case "iprice":
      return companyRepo.updateIPrice(req.body)
        .then(() => next());

    case "tprice":
      return companyRepo.updateTPrice(req.body)
        .then(() => next());

    case "sprice":
      return companyRepo.updateSPrice(req.body)
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

module.exports = router;
