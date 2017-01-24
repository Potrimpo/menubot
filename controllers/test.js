const express = require('express'),
  router = express.Router();

const db = require('../repositories/site/CompanyRepository'),
  { prop, indexBy, map } = require('ramda');

router.route('/:fbid')
  .get((req, res) => res.render('test', {
    fbid: req.params.fbid,
    title: 'test'
  })
);

router.route('/:fbid/confdata')
  .get((req, res) => {
    const data = getMenu(req.params.fbid)
    console.log('data from confdata: ', data);
    res.send(data)
  });


const getMenu = fbid => db.getMenuItemsByCompId(fbid)
  .then(items => {
    const menu = {items: indexBy(prop('itemid'), items)};
    return db.getMenuTypes((items) => items.map(item => item.itemid))
  })
  .then(types => {
    menu.types = indexBy(prop('typeid'), types);
    return db.getMenuSizes((types) => types.map(type => type.typeid))
  })
  .then(sizes => {
    menu.sizes = indexBy(prop('sizeid'), sizes)
    return menu
  })

module.exports = router;
