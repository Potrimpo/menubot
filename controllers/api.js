"use strict";

const express = require('express'),
  router = express.Router(),
  fetch = require('node-fetch'),
  db = require('../repositories/site/CompanyRepository'),
  { activateBot, deactivateBot } = require('./activateAccount');

router.route('/activate/:fbid')
  .get((req, res) =>
    db.findCompany(req.params.fbid)
      .then(data => activateBot(data.access_token))
      .then(() => db.setBotStatus(req.params.fbid, true))
      .then(() => res.redirect(`/company/${req.params.fbid}`))
      .catch(() => res.status(500).redirect(`/company/${req.params.fbid}`))
  );

router.route('/deactivate/:fbid')
  .get((req, res) =>
    db.findCompany(req.params.fbid)
      .then(data => deactivateBot(data.access_token))
      .then(() => db.setBotStatus(req.params.fbid, false))
      .then(() => res.redirect(`/company/${req.params.fbid}`))
  );

router.route('/photos/:fbid')
  .get((req, res) =>
    db.findCompany(req.params.fbid)
      .then(data => syncPhotos(data.access_token))
      .then(() => res.redirect(`/company/${req.params.fbid}`))
      .catch(e => {
        console.error("error getting photos from facebook:", e);
        return res.status(500).redirect(`/company/${req.params.fbid}`);
      })
  );

function syncPhotos (pageToken) {
  return fetchPhotos(pageToken)
    .then(response => {
      const fbid = response.id;
      const rightAlbum = response.albums.data.filter(album => album.name.toLowerCase() == "menu");
      const photos = rightAlbum[0].photos.data
        .filter(val => val && val.picture && val.name);
      // add photos to items table, matching the name in the description of the facebook photo to item names
      return Promise.all(
        photos.map(val => db.addItemPhotos(val, fbid)).concat(syncTypePhotos(fbid, photos))
      )
    })
}

function syncTypePhotos (fbid, photos) {
  return db.getTypesThroughFbid(fbid)
    .then(types => {
      const photosWithTypeids = photos.map(val => {

        for (let x = types.length - 1; x >= 0; x--) {
          if (types[x].type.toLowerCase() == val.name.toLowerCase()) {
            val.typeid = types[x].typeid;
            return val
          }
        }

        return null;
      })
        .filter(val => val);

      return photosWithTypeids.map(val => db.addTypePhotos(val))
    });
}

// fetches albums from facebook page
function fetchPhotos (pageToken) {
  pageToken = encodeURIComponent(pageToken);
  const url = `https://graph.facebook.com/me?fields=albums{photos{name,picture},name}&access_token=${pageToken}`;

  return fetch(url, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      console.log("JSON ====", json);
      return json;
    })
    .catch(err => console.error("error fetching photos for this menu!", err));
}

module.exports = router;
