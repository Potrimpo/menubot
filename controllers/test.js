const express = require('express'),
  router = express.Router();

const db = require('../repositories/site/CompanyRepository'),
  { prop, indexBy, map } = require('ramda'),
  { Promise } = require('bluebird');

router.route('/:fbid')
  .get((req, res) => res.render('test', {
    fbid: req.params.fbid,
    title: 'test'
  })
);

router.route('/:fbid/confdata')
  .get((req, res) => {
    getMenu(req.params.fbid)
      .then((menu) => {
        res.send(menu)
      })
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
