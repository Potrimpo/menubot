/**
 * Created by lewis.knoxstreader on 24/10/16.
 */
const { sessions } = require('../messengerSessions'),
  actions = require('./actions');

function runActions (sessionId, request, context) {
  return actions.orderTime(sessions[sessionId], request)
    .then(ctx => {

      if (ctx.pickupTime && (ctx.item || ctx.type || ctx.size) && !ctx.noLuck) {
        const success = "Success!";
        return actions.send({sessionId}, {text: success})
          .then(() => {
            let orderResponse;
            if (ctx.size) orderResponse = `Order for one ${ctx.size} ${ctx.type} ${ctx.item} @ ${ctx.pickupTime}`;
            else if (ctx.type) orderResponse = `Order for one ${ctx.type} ${ctx.item} @ ${ctx.pickupTime}`;
            else orderResponse = `Order for one ${ctx.item} @ ${ctx.pickupTime}`;
            return actions.send({sessionId}, {text: orderResponse});
          })
      }

      const orderFailure = "Sorry, we couldn't place that order for some reason!";
      return actions.send({sessionId}, {text: orderFailure});

    })
    .catch(err => {
      console.error("error in runActions", err);
      return actions.send({sessionId}, {text: "Sorry! We ran into an error doing that.", err});
    })
}

module.exports = runActions;
