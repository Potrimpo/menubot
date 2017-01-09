const structured = require('./../structured-messages'),
  text = require('./../text-messages'),
  db = require('./../../repositories/bot/botQueries');

function postbackHandler (jsonPayload, fbUserId, fbPageId, timestamp) {
  return new Promise(function (res, rej) {
    const payload = JSON.parse(jsonPayload);

    switch (payload.intent.toUpperCase()) {
      case 'MENU':
        return db.getMenu(fbPageId)
          .then((menu) => res(structured.items(menu)) )
          .catch(err => rej(err));

      case 'LOCATION':
        return db.findLocation(fbPageId)
          .then(data => res(text.location(data.location)))
          .catch(err => rej(err));

      case 'DETAILS':
        return db.getTypes(payload.itemid)
          .then(types => res(structured.types(types, payload.itemid)) )
          .catch(err => rej(err));

      case 'SIZES':
        return db.getSizes(payload.typeid)
          .then(sizes => res(structured.sizes(sizes, payload.typeid, payload.itemid)) )
          .catch(err => rej(err));

      case 'ORDER':
        return db.checkOpenStatus(fbPageId)
          .then(status => text.openStatus(status, fbUserId, payload, timestamp))
          .then(resp => res(resp))
          .catch(err => rej(err));

      case 'MY_ORDERS':
        return db.ordersbyUserid(fbUserId)
          .then(xs =>
            res(text.hasOrders(xs)))
          .catch(err => rej(err));

      case 'HOURS':
        return db.checkOpenStatus(fbPageId)
          .then(data => res(text.hours(data)))
          .catch(err => rej(err));

      case 'GET_STARTED':
       return res(structured.getStarted());

      default:
        return rej(new Error("couldn't deal with this postbackHandler input"));
    }

  })
    .catch(err => {
      const payload = JSON.parse(jsonPayload);
      console.error(`Error in ${payload.intent} postback:`, err)
    });
}

module.exports = postbackHandler;
