"use strict";

const express = require('express'),
  router = express.Router(),
  fetch = require('node-fetch'),
  { retrieveOrders, setOrderComplete } = require('./orders'),
  { findCompany, setBotStatus, addPhotos } = require('../repositories/CompanyRepository'),
  { activateBot } = require('./activateAccount');


// absolute path is /api/orders/:fbid
router.route('/orders/:fbid')
  .get(retrieveOrders, (req, res) => {
    return res.json(req.orders);
  })
  .post(setOrderComplete, (req, res) => {
    return res.send('ur postin 2 me & i think it done worked');
  });

router.route('/activate/:fbid')
  .get((req, res) => {
    return findCompany(req.params.fbid)
      .then(data => activateBot(data.access_token))
      .then(() => setBotStatus(req.params.fbid, true))
      .then(() => res.redirect('/'));
  });

router.route('/photos/:fbid')
  .get((req, res) => {
    return findCompany(req.params.fbid)
      .then(data => syncPhotos(data.access_token))
      .then(() => res.redirect(`/company/${req.params.fbid}`))
      .catch(e => {
        console.error("error getting photos from facebook:", e);
        return res.status(500).redirect(`/company/${req.params.fbid}`);
      })
  });

function syncPhotos (pageToken) {
  return fetchPhotos(pageToken)
    .then(response => {
      const rightAlbum = response.albums.data.filter(album => album.name == "menu");
      const photos = rightAlbum[0].photos.data;
      console.log("PHOTOS NAMES ===", photos.map(val => val.name));
      console.log("PHOTOS link ===", photos.map(val => val.picture));
      return Promise.all(
        photos.map(val => addPhotos(val, response.id))
      );
    })
    .then(data => {
      console.log("DATA FROM MASS UPDATE ===", data);
      return data
    });
}

function fetchPhotos (pageToken) {
  const body = {};
  pageToken = encodeURIComponent((pageToken));
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
