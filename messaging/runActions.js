/**
 * Created by lewis.knoxstreader on 24/10/16.
 */

const actions = require('./actions');

function runActions (fbUserId, fbPageId, msg) {
  // the only text messages it knows how to deals with are order times
  return actions.orderTime(fbUserId, fbPageId, msg)
    .then(order => {
      const responses = [];
      // put quickreplies on both because we have no guarantee which one will arrive first
      responses.push(orderConfirm("Success!"));
      responses.push(orderConfirm(order.confirmationMsg));

      return responses;
    })
    .catch(err => {
      console.error("error in runActions", err);
      throw "Sorry! we couldn't place that order for some reason!";
    });
}

function orderConfirm (text) {
  return {
    text: text,
    quick_replies: [{
      content_type: "text",
      title: "Menu",
      payload: JSON.stringify({ intent: "MENU" })
    }, {
      content_type: "text",
      title: "My Orders",
      payload: JSON.stringify({ intent: "MY_ORDERS" })
    }]
  };
}

module.exports = runActions;
