/**
 * Created by lewis.knoxstreader on 24/10/16.
 */

const actions = require('./actions');

function runActions (fbUserId, fbPageId, request) {
  return actions.orderTime(fbUserId, fbPageId, request)
    .then(orderInfo => {
      const responses = [];
      if (orderInfo.pickupTime && (orderInfo.item || orderInfo.type || orderInfo.size) && !orderInfo.noLuck) {
        responses.push("Success!");

        if (orderInfo.size) {
          responses.push(
            `Order for one ${orderInfo.size} ${orderInfo.type} ${orderInfo.item} @ ${orderInfo.pickupTime}`
          );
        }
        else if (orderInfo.type) {
         responses.push(
           `Order for one ${orderInfo.type} ${orderInfo.item} @ ${orderInfo.pickupTime}`
         );
        }
        else {
         responses.push(
           `Order for one ${orderInfo.item} @ ${orderInfo.pickupTime}`
         );
        }

        return responses;
      }
      throw "runActions confused"
    })
    .catch(err => {
      console.error("error in runActions", err);
      throw "Sorry! we couldn't place that order for some reason!";
    })
}

module.exports = runActions;
