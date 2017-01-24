const express = require('express'),
  router = express.Router(),
  fetch = require('node-fetch'),
  R = require('ramda'),
  db = require('../repositories/site/CompanyRepository'),
  { activateBot, deactivateBot } = require('./activate-bot');

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


const pullUrlProp = R.prop('source');

const takeBiggestImg = photo => ({
  picture: pullUrlProp(R.head(photo.webp_images)),
  name: photo.name
});

const usablePhotos = photo => photo && photo.picture && photo.name;
const menuAlbum = album => album.name.toLowerCase() === "menu";

// [{}] -> [{}]
const filterPhotosForMenu =
  R.pipe(
    R.filter(menuAlbum),
    R.head,
    R.path(['photos', 'data']),
    R.map(takeBiggestImg),
    R.filter(usablePhotos));

// Number -> [{}] -> [Promise]
const insertItemAndTypePhotosUncurried = (fbid, photos) =>
  photos
    .map(url => db.addItemPhotos(url, fbid))
    .concat(syncTypePhotos(fbid, photos));

const insertItemAndTypePhotos = R.curry(insertItemAndTypePhotosUncurried);

// {} -> [Promise]
const getAndInsertImages = response =>
  R.pipe(
    R.path(['albums', 'data']),
    filterPhotosForMenu,
    insertItemAndTypePhotos(response.id),
    // can't be called first-class, no idea why
    x => Promise.all(x))
  (response);

// Number -> Promise
const syncPhotos = pageToken =>
  fetchAlbums(pageToken)
    .then(getAndInsertImages);

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
function fetchAlbums (pageToken) {
  pageToken = encodeURIComponent(pageToken);
  const url = `https://graph.facebook.com/me?fields=albums{photos{name,webp_images},name}&access_token=${pageToken}`;

  return fetch(url, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  })
    .then(rsp => rsp.json())
    .then(json => {
      if (json.error && json.error.message) {
        throw new Error(json.error.message);
      }
      return json;
    })
    .catch(err => console.error("error fetching photos for this menu!", err));
}

module.exports = router;
