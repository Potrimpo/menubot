/**
 * Created by lewis.knoxstreader on 24/10/16.
 */

const actions = require('./actions');

function runActions (fbUserId, fbPageId, msg) {
  // the only text messages it knows how to deals with are order times
  return actions.orderTime(fbUserId, fbPageId, msg)
    .then(order => order.toString())
    .catch(err => {
      console.error("error in runActions", err);
      throw "Sorry! we couldn't place that order for some reason!";
    });
}

module.exports = runActions;
