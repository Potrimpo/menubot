/**
 * Created by lewis.knoxstreader on 31/08/16.
 */

const actions = require('./actions'),
  // { getMenu, getTypes, getSizes } = require('../sql'),
  { Company, Item, Type, Size } = require('./../database/models/index'),
  db = require('./../repositories/bot/botQueries'),
  { tunnelURL } = require('../envVariables');

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

      case 'ORDER':
        console.log("EXECUTING ORDER");
        // make sure wit.ai doesn't reuse data from a previous order!
        delete userSession.context.pickupTime;
        userSession.context.order = { typeid: parsedPayload[2], sizeid: parsedPayload[3] };
        return res({ text: "what time would you like that? (include am/pm)" });

      case 'SIZES':
        return db.getSizes(parsedPayload[2])
          .then(sizes => res(parseProductSizes(sizes)) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'GET_STARTED':
        console.log("GETTING SHIT GOING MY DUDE");
       return res(getStarted());

      default:
        return rej(new Error("couldn't deal with this postbackHandler input"));
    }

  });
}

function parseItems(menu) {
  const template = {
    attachment: {
      type:"template",
      payload: { template_type:"generic" }
    }
  };
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
  const template = {
    attachment: {
      type:"template",
      payload: { template_type:"generic" }
    }
  };
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
  const template = {
    attachment: {
      type:"template",
      payload: { template_type:"generic" }
    }
  };
  template.attachment.payload.elements = sizes.map(val => {
    return {
      title: `${val.size.toUpperCase()} - $${String(val.price)}`,
      buttons: [
        {
          type: 'postback',
          title: 'Order',
          payload: `ORDER!${val.typeid}/${val.sizeid}`
        },
      ]
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

module.exports = postbackHandler;