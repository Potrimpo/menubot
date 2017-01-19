const db = require('./../repositories/bot/botQueries'),
  structured = require('./structured-messages'),
  text = require('./text-messages');

const getMenu = pageId =>
  db.getMenu(pageId)
    .then(text.menu);

const getLocation = pageId =>
  db.findLocation(pageId)
    .then(data => text.location(data.location));

const getTypes = itemid =>
  db.getTypes(itemid)
    .then(types => structured.types(types, itemid));

const getSizes = (typeid, itemid) =>
  db.getSizes(typeid)
    .then(sizes => structured.sizes(sizes, typeid, itemid));

const placeOrder = (pageId, userId, payload, timestamp) =>
  db.checkOpenStatus(pageId)
    .then(status => text.openStatus(status, userId, payload, timestamp));

const myOrders = userId =>
  db.ordersbyUserid(userId)
    .then(xs => text.hasOrders(xs));

const getHours = pageId =>
  db.checkOpenStatus(pageId)
    .then(data => text.hours(data));

module.exports = {
  getMenu,
  getTypes,
  getSizes,
  placeOrder,
  myOrders,
  getHours,
  getLocation
};
