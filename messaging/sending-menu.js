/**
 * Created by lewis.knoxstreader on 31/08/16.
 */

const actions = require('./actions'),
  db = require('./../repositories/bot/botQueries');

function postbackHandler (payload, userSession) {
  return new Promise(function (res, rej) {
    const { fbPageId, fbUserId } = userSession,
      parsedPayload = /([A-Z]+_?[A-Z]*)!?(\d*)/g.exec(payload);

    console.log("PARSED PAYLOAD =", parsedPayload);

    switch (parsedPayload[1].toUpperCase()) {
      case 'MENU':
        return db.getMenu(fbPageId)
          .then((menu) => res(parseItems(menu)) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'LOCATION':
        return db.findLocation(fbPageId)
          // a text response must be returned in the 'text' field of an object
          .then(data => res({ text: data.location }) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'DETAILS':
        return db.getTypes(parsedPayload[2])
          .then(types => res(parseProductTypes(types)) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'SIZES':
        return db.getSizes(parsedPayload[2])
          .then(sizes => res(parseProductSizes(sizes)) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'ORDER':
        console.log("EXECUTING ORDER");
        // make sure wit.ai doesn't reuse data from a previous order!
        delete userSession.context.pickupTime;
        // wit.ai resets the context after sending, so we cant store this data there
        console.log("session order =", userSession.order);
        userSession.order = { sizeid: parsedPayload[2] };
        console.log("IN POSTBACK HANDLER", userSession);
        return res({ text: "what time would you like that? (include am/pm)" });

      case 'MY_ORDERS':
        console.log("--> looking at my orders <--");
        return db.getOrders(fbUserId)
          .then(orders => res(parseOrders(orders)))
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback`, err));

      case 'GET_STARTED':
        console.log("GETTING SHIT GOING MY DUDE");
       return res(getStarted());

      default:
        return rej(new Error("couldn't deal with this postbackHandler input"));
    }

  });
}

function parseItems(menu) {
  const template = genericTemplate();
  template.attachment.payload.elements = menu.map(val => {
    return {
      title: val.item.toUpperCase(),
      image_url: val.photo,
      buttons: [
        {
          type: 'postback',
          title: 'Details',
          payload: `DETAILS!${val.itemid}`
        }
      ]
    };
  });
  return template;
}

function parseProductTypes(types) {
  const template = genericTemplate();
  template.attachment.payload.elements = types.map(val => {
    return {
      title: val.type.toUpperCase(),
      image_url: val.photo,
      buttons: [
        {
          type: 'postback',
          title: 'Order',
          payload: `ORDER!${val.typeid}`
        },
        {
          type: 'postback',
          title: 'Sizes',
          payload: `SIZES!${val.typeid}`
        },
      ]
    };
  });
  return template;
}

function parseProductSizes(sizes) {
  const template = genericTemplate();
  template.attachment.payload.elements = sizes.map(val => {
    return {
      title: `${val.size.toUpperCase()} - $${String(val.price)}`,
      buttons: [
        {
          type: 'postback',
          title: 'Order',
          payload: `ORDER!${val.sizeid}`
        },
      ]
    };
  });
  return template;
}

function parseOrders(orders) {
  const template = genericTemplate();
  template.attachment.payload.elements = orders.map(val => {
    return {
      title: `${val.size.toUpperCase()} ${val.type.toUpperCase()} ${val.item.toUpperCase()}`,
      subtitle: `$${val.price}`
    };
  });
  return template;
}

function getStarted () {
  return {
    text: "Welcome to the menu.bot experience",
    quickreplies:[ "Menu" ]
  };
}

function genericTemplate () {
  return {
    attachment: {
      type:"template",
      payload: { template_type:"generic" }
    }
  };
}

module.exports = postbackHandler;