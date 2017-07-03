const express = require('express'),
  router = express.Router(),
  { syncPhotos } = require('./api'),
  { activateBot, deactivateBot } = require('./activate-bot.js');

//NOTE: NONE OF THIS IS SECURE YET, ADD SECURITY FUCKWIT

const db = require('../repositories/site/CompanyRepository'),
  { prop, indexBy, map } = require('ramda'),
  { Promise } = require('bluebird');

router.route('/:fbid')
  .get((req, res) => res.render('test', {
    fbid: req.params.fbid,
    title: 'Configuration'
  })
);

router.route('/:fbid/nervecenter')
  .get((req, res) => {
    getCompanyInfo(req.params.fbid)
      .then((companyInfo) => {
        res.send(companyInfo)
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

      case 'CHANGE_COMPANY':
        db.changeCompany(data)
          .then((response) => res.sendStatus(200))
          .catch((err) => {
            console.log("Error changing company: ", err);
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
        db.insertType(data.name, data.id, data.fbid)
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
        db.insertSize(data.name, data.id, data.fbid)
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
            console.log("Error changing item: ", err);
            res.sendStatus(403)
          })
        break;

      case 'DELETING_TYPE':
        console.log("DELETING_Type");
        db.deleteItem({type: "item", deleteId: data.id})
          .then((response) => res.sendStatus(200))
          .catch((err) => {
            console.log("Error changing item: ", err);
            res.sendStatus(403)
          })
        break;

      case 'DELETING_ITEM':
        console.log("DELETING_ITEM");
        db.deleteItem({type: "item", deleteId: data.id})
          .then((response) => res.sendStatus(200))
          .catch((err) => {
            console.log("Error changing item: ", err);
            res.sendStatus(403)
          })
        break;

      case 'REQUEST_PHOTOS':
        syncPhotos(data.access_token)
          .then((response) => getUpdatedMenu(data.fbid))
          .then((updatedMenu) => res.send(updatedMenu))
          .catch((err) => {
            console.log("Error fetching photos: ", err);
            res.sendStatus(403)
          })
        break;

      case 'ACTIVATE_BOT':
        activateBot(data.access_token)
          .then(() => db.setBotStatus(data.fbid, true))
          .then(() => res.sendStatus(200))
          .catch(() => res.sendStatus(403))
        break;

      case 'DEACTIVATE_BOT':
        deactivateBot(data.access_token)
          .then(() => db.setBotStatus(data.fbid, false))
          .then(() => res.sendStatus(200))
          .catch(() => res.sendStatus(403))
        break;

      default:
        res.sendStatus(403)
    }
  });





const getCompanyInfo = (fbid) => {
  const itemProm = db.getMenuItemsByCompId(fbid);
  const typeProm = db.getMenuTypesByCompId(fbid);
  const sizeProm = db.getMenuSizesByCompId(fbid);
  const companyProm = db.getCompany(fbid);

  return Promise.join(itemProm, typeProm, sizeProm, companyProm,
    (items, types, sizes, company) => {
      const companyInfo = {};
      companyInfo.items = indexBy(prop('itemid'), items);
      companyInfo.types = indexBy(prop('typeid'), types);
      companyInfo.sizes = indexBy(prop('sizeid'), sizes);
      companyInfo.company = company;
      return companyInfo
    }
  )
}

const getUpdatedMenu = (fbid) => {
  const itemProm = db.getMenuItemsByCompId(fbid);
  const typeProm = db.getMenuTypesByCompId(fbid);

  return Promise.join(itemProm, typeProm,
    (items, types) => {
      const updatedMenu = {};
      updatedMenu.items = indexBy(prop('itemid'), items);
      updatedMenu.types = indexBy(prop('typeid'), types);
      return updatedMenu
    }
  )
}

module.exports = router;
