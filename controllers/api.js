"use strict";

const express = require('express'),
  router = express.Router(),
  fetch = require('node-fetch'),
  { retrieveOrders, setOrderComplete } = require('./orders'),
  { findCompany, setBotStatus, addItemPhotos, getTypesThroughFbid, addTypePhotos } = require('../repositories/CompanyRepository'),
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
  let fbid = "";
  let photos = [];
  return fetchPhotos(pageToken)
    .then(response => {
      fbid = response.id;
      const rightAlbum = response.albums.data.filter(album => album.name == "menu");
      photos = rightAlbum[0].photos.data;
      console.log("PHOTOS NAMES ===", photos.map(val => val.name));
      // add photos to items table, matching the name in the description of the facebook photo to item names
      return Promise.all(
        photos.map(val => addItemPhotos(val, fbid))
      );
    })
    .then(() => getTypesThroughFbid(fbid))
    .then(data => {
      console.log("DATA FROM GETTING TYPES ==", data);
      console.log("HPTOOSO ====", photos);
      const photosWithTypeids = photos
        .map(val => {
          for (let x = data.length - 1; x >= 0; x--) {
            if (data[x].type == val.name) {
              val.typeid = data[x].typeid;
              return val
            }
          }
          return null;
        })
        .filter(val => val);
      console.log("HPTOSO WITH TYPEIDS =======^^^^^==== ", photosWithTypeids);
      return Promise.all(
        photosWithTypeids.map(val => addTypePhotos(val))
      );
    });
}

// fetches albums from facebook page
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
