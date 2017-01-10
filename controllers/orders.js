/**
 * Created by lewis.knoxstreader on 3/10/16.
 */

const db = require("../repositories/site/CompanyRepository"),
  moment = require('moment-timezone');

// universally callable functions
exports.fetchOrders = fbid =>
  db.ordersByFbid(fbid)
    .catch(err => res.status(500).send('error getting orders'));

exports.setOrderComplete = data =>
  db.orderComplete(data)
    .catch(err => console.log("error setting orders", err));

exports.setDelay = (fbid, time) =>
  db.setDelayTime(fbid, time)
    .catch(e => console.error("failed to set delay time:", e));
