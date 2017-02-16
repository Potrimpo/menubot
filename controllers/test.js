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
        console.log(menu);
        res.send(menu)
      })
  })
  .post((req, res) => {
    const data = req.body;
    console.log('====== There has been a post query Daish: ', data);
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

      case 'MAKING_ITEM':
        db.insertItem(data.fbid, data.name)
          .then((response) => {
            res.send({
              name: response.item,
              photo: response.item_photo,
              price: response.item_price,
              newId: response.itemid
            })
          })
          .catch((err) => {
            console.log("Error changing size: ", err);
            res.sendStatus(403)
          })
        break;

      case 'MAKING_TYPE':
        db.insertType(data.name, data.id, data.fbid, data.parentPrice)
          .then((response) => {
            console.log("response to making type: ", response);
            res.send({
              name: response.type,
              photo: response.type_photo,
              price: response.type_price,
              newId: response.typeid,
              parentId: response.itemid
            })
          })
          .catch((err) => {
            console.log("Error changing size: ", err);
            res.sendStatus(403)
          })
        break;

      case 'MAKING_SIZE':
        db.insertSize(data.name, data.id, data.fbid, data.parentPrice)
          .then((response) => {
            console.log("response to making size: ", response);
            res.send({
              name: response.size,
              price: response.size_price,
              newId: response.sizeid,
              parentId: response.typeid
            })
          })
          .catch((err) => {
            console.log("Error changing size: ", err);
            res.sendStatus(403)
          })
        break;

      case 'DELETING_ITEM':
        console.log("DELETING_ITEM");
        db.deleteItem({type: "item", deleteId: data.id})
          .then((response) => res.sendStatus(200))
          .catch((err) => {
            console.log("Error deleting item: ", err);
            res.sendStatus(403)
          })
        break;

      case 'DELETING_TYPE':
        console.log("DELETING_TYPE");
        db.deleteItem({type: "type", deleteId: data.id})
          .then((response) => res.sendStatus(200))
          .catch((err) => {
            console.log("Error deleting type: ", err);
            res.sendStatus(403)
          })
        break;

      case 'DELETING_SIZE':
        console.log("DELETING_SIZE");
        db.deleteItem({type: "size", deleteId: data.id})
          .then((response) => res.sendStatus(200))
          .catch((err) => {
            console.log("Error deleting size: ", err);
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
  console.log("Activating menu promise now!");

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
