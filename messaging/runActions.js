/**
 * Created by lewis.knoxstreader on 24/10/16.
 */

const actions = require('./actions');

function runActions (fbUserId, fbPageId, request) {
  return actions.orderTime(fbUserId, fbPageId, request)
    .then(orderInfo => {

      if (orderInfo.pickupTime && (orderInfo.item || orderInfo.type || orderInfo.size) && !orderInfo.noLuck) {
        const success = "Success!";
        return actions.send(fbUserId, {text: success})
          .then(() => {
            let orderResponse;
            if (orderInfo.size) orderResponse = `Order for one ${orderInfo.size} ${orderInfo.type} ${orderInfo.item} @ ${orderInfo.pickupTime}`;
            else if (orderInfo.type) orderResponse = `Order for one ${orderInfo.type} ${orderInfo.item} @ ${orderInfo.pickupTime}`;
            else orderResponse = `Order for one ${orderInfo.item} @ ${orderInfo.pickupTime}`;
            return actions.send(fbUserId, {text: orderResponse});
          })
      }

      const orderFailure = "Sorry, we couldn't place that order for some reason!";
      return actions.send(fbUserId, {text: orderFailure});

    })
    .catch(err => {
      console.error("error in runActions", err);
      return actions.send(fbUserId, {text: `Sorry! We ran into an error doing that: ${err}`});
    })
}

module.exports = runActions;
