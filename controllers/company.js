/**
 * Created by lewis.knoxstreader on 20/09/16.
 */

const express = require('express'),
  router = express.Router();

const db = require('../repositories/site/CompanyRepository'),
  Item = require('../classes/Item'),
  Type = require('../classes/Type'),
  Size = require('../classes/Size');

router.param('companyId', (req, res, next, id) => {
  console.log("ID PROVIDED =", id);
  req.body.id = id;
  return next();
});

router.route('/:companyId')
  .get((req, res) => {
    console.log("------ getting company menu -------", req.params.companyId);
    return getMenu(req.params.companyId)
      .then(data => {
        return res.render('account/company', {
          bot_status: data.bot_status,
          location: data.location,
          opentime: data.opentime,
          closetime: data.closetime,
          compName: data.name,
          fbid: data.fbid,
          title: data.name,
          items: data.items,
          types: data.types,
          sizes: data.sizes
        });
      })
      .catch(err => console.error("error building menu", err));
  })
  .post(add_to_menu)
  .delete((req, res) => {
    return db.deleteItem(req.body)
      .then(() => res.status(200).send())
      .catch(err => console.error("error deleting menu item", err));
  });

router.route('/init/:companyId')
  .post((req, res) => {
    return db.linkCompany(req.user.id, req.body.id)
      .then(data => res.redirect(`/company/${data[0].fbid}`));
});

router.route('/location/:companyId')
  .post((req, res) => {
    return db.setLocation(req.body.id, req.body.location)
      .then(() => res.status(200).send())
      .catch(err => console.error("error updating location field", err));
  });

router.route('/time/:companyId')
  .post((req, res) => {
    if (req.body.state == 'opentime') {
      return db.setOpenTime(req.body.id, req.body.time, req.body.state)
      .then(() => res.status(200).send())
      .catch(err => console.error("error updating time field", err));
    } else if (req.body.state == 'closetime') {
      return db.setCloseTime(req.body.id, req.body.time, req.body.state)
      .then(() => res.status(200).send())
      .catch(err => console.error("error updating time field", err));
    }
  });


function getMenu (id) {
  return db.getCompanyMenu(id)
    .then(data => {
      if (data.length > 0) return fullMenu(id, data);
      else return db.findCompany(id)
    })
    .catch(err => console.error("error in getMenu", err.message || err));
}

function fullMenu (fbid, data) {
  const itemids = data.map(val => val.itemid);
  const wholeMenu = {
    name: data[0].name,
    bot_status: data[0].bot_status,
    location: data[0].location,
    opentime: data[0].opentime,
    closetime: data[0].closetime,
    fbid,
    items: data
  };

  return db.getMenuTypes(itemids)
    .then(types => {
      wholeMenu.types = types;
      const typeids = types.map(val => val.typeid);

      //If there aren't any types, doesn't ask the database to produce the sizes related to the (non-existant) types
      if (typeids.length !== 0) {
        return db.getMenuSizes(typeids)
      }
    })
    .then(sizes => {
      wholeMenu.sizes = sizes;
      return wholeMenu
    });
}

function add_to_menu(req, res) {
  console.log(req.body);
  return new Promise((resolve, reject) => {
    switch (req.body.intent) {
      case "item":
        return new Item(req.body).dbInsert()
          .then(() => resolve());
      case "type":
        return new Type(req.body).dbInsert()
          .then(() => resolve());

      case "size":
        return new Size(req.body).dbInsert()
          .then(() => resolve());

      case "iprice":
        return new Item(req.body).updatePrice()
          .then(() => resolve());

      case "tprice":
        return new Type(req.body).updatePrice()
          .then(() => resolve());

      case "sprice":
        return new Size(req.body).updatePrice()
          .then(() => resolve());

      default:
        return reject(`no case for update intent: ${req.body.intent}`);
    }
  })
    .then(() => res.status(200).send())
    .catch(err => console.error("error adding item to menu", err));
}

module.exports = router;
