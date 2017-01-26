const express = require('express'),
  router = express.Router();

//NOTE: NONE OF THIS IS SECURE YET, ADD SECURITY FUCKWIT

const db = require('../repositories/site/CompanyRepository'),
  { prop, indexBy, map } = require('ramda'),
  { Promise } = require('bluebird');

router.route('/:fbid')
  .get((req, res) => res.render('test', {
    fbid: req.params.fbid,
    title: 'test'
  })
);

router.route('/:fbid/nervecenter')
  .get((req, res) => {
    getMenu(req.params.fbid)
      .then((menu) => {
        res.send(menu)
      })
  })
  .post((req, res) => {
    const data = req.body;
    console.log('There has been a post query Daish: ', data);
    switch (data.request) {
      case 'CHANGE_ITEM':
        db.changeItem(data)
          .then((response) => res.sendStatus(200))
          .catch((err) => {
            console.log("Error changing item: ", err);
            res.sendStatus(403)
          })
        break;

      case 'CHANGE_TYPE':
        db.changeType(data)
          .then((response) => res.sendStatus(200))
          .catch((err) => {
            console.log("Error changing type: ", err);
            res.sendStatus(403)
          })
        break;

      case 'CHANGE_SIZE':
        db.changeSize(data)
          .then((response) => res.sendStatus(200))
          .catch((err) => {
            console.log("Error changing size: ", err);
            res.sendStatus(403)
          })
        break;

      default:
        res.sendStatus(403)
    }
  });

const getMenu = (fbid) => {
  const itemProm = db.getMenuItemsByCompId(fbid);
  const typeProm = db.getMenuTypesByCompId(fbid);
  const sizeProm = db.getMenuSizesByCompId(fbid);

  return Promise.join(itemProm, typeProm, sizeProm,
    (items, types, sizes) => {
      const menu = {};
      menu.items = indexBy(prop('itemid'), items);
      menu.types = indexBy(prop('typeid'), types);
      menu.sizes = indexBy(prop('sizeid'), sizes);
      return menu
    }
  )
}

module.exports = router;
