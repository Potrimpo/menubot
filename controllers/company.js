const express = require('express'),
  router = express.Router();

const db = require('../repositories/site/CompanyRepository'),
  Item = require('../classes/Item'),
  Type = require('../classes/Type'),
  Size = require('../classes/Size');

router.param('companyId', (req, res, next, fbid) => {
  console.log("FBID PROVIDED =", fbid);
  req.body.fbid = fbid;
  return next();
});

router.route('/:companyId')
  .get((req, res) =>
    getMenu(req.params.companyId)
      .then(data =>
        res.render('account/company', {
          bot_status: data.bot_status,
          location: data.location,
          opentime: data.opentime,
          closetime: data.closetime,
          status: data.status,
          compName: data.name,
          fbid: data.fbid,
          title: data.name,
          items: data.items,
          types: data.types,
          sizes: data.sizes
        })
      )
      .catch(err => console.error("error building menu", err))
  )
  // add to menu
  .post(add_to_menu)
  // add price to existing menu entry
  .put(updatePrice)
  .delete((req, res) =>
    db.deleteItem(req.body)
      .then(() => res.status(200).send())
      .catch(err => console.error("error deleting menu item", err))
  );

router.route('/init/:companyId')
  .post((req, res) =>
    db.linkCompany(req.user.id, req.params.companyId, req.body.timezone)
      .then(data => res.send({redirect: `/company/${data[0].fbid}`}))
  );

router.route('/location/:companyId')
  .post((req, res) =>
    db.setLocation(req.body.fbid, req.body.location)
      .then(() => res.status(200).send())
      .catch(err => console.error("error updating location field", err))
  );

router.route('/hours/:companyId')
  .post((req, res) =>
    db.setOpenHours(req.body)
      .then(() => res.status(200).send())
      .catch(err => {
        const msg = "error setting company open hours";
        console.error(msg, err);
        return res.status(500).send(msg);
      })
  );

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
    status: data[0].status,
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

      default:
        return reject(`no case for update intent: ${req.body.intent}`);
    }
  })
    .then(() => res.status(200).send())
    .catch(err => {
      const msg = "error adding item to menu";
      console.error(msg, err);
      return res.status(500).send(msg);
    });
}

function updatePrice (req, res) {
 return new Promise((resolve, reject) => {
   switch (req.body.kind) {
     case "item":
       return new Item(req.body).updatePrice()
         .then(() => resolve());

     case "type":
       return new Type(req.body).updatePrice()
         .then(() => resolve());

     case "size":
       return new Size(req.body).updatePrice()
         .then(() => resolve());

     default:
       return reject(`no case for update kind: ${req.body.kind}`);
   }
 })
   .then(() => res.status(200).send())
   .catch(err => {
     const msg = "error updating entry price";
     console.error(msg, err);

     return res.status(500).send(msg);
   });
}

module.exports = router;
