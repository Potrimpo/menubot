/**
 * Created by lewis.knoxstreader on 24/10/16.
 */
const { sessions } = require('../witSessions'),
  actions = require('./actions');

function runActions (sessionId, request, context) {
  console.log("sessionId: runActions =", sessionId);
  console.log("session: runActions =", sessions[sessionId]);
  // console.log("all sessions", sessions);
  return actions.orderTime(sessions[sessionId], request)
    .then(ctx => {

      if (ctx.pickupTime && ctx.item && ctx.type && ctx.size && !ctx.noLuck) {
        const success = "Success!";
        return actions.send({sessionId}, success)
          .then(() => {
            const orderResponse = `Order for one ${ctx.size} ${ctx.type} ${ctx.item} @ ${ctx.pickupTime}`;
            return actions.send({sessionId}, orderResponse);
          })
      }

      const orderFailure = "Sorry, we couldn't place that order for some reason!";
      return actions.send({sessionId}, orderFailure);

    })
    .catch(err => {
      console.error("error in runActions", err);
      return actions.send({sessionId}, "Sorry! We ran into an error doing that.", err);
    })
}

module.exports = runActions;
