/**
 * Created by lewis.knoxstreader on 31/08/16.
 */

const actions = require('./actions'),
  { getMenu, getTypes, getSizes } = require('../sql'),
  { Company, Item, Type } = require('./../database'),
  { tunnelURL } = require('../envVariables');

function postbackHandler (payload, userSession) {
  return new Promise(function (res, rej) {
    const { fbPageId, fbUserId } = userSession,
      parsedPayload = /([A-Z]+)!?(\d*)\/?(\d*)/g.exec(payload);

    switch (parsedPayload[1]) {
      case 'MENU':
        return Item.getMenu(fbPageId)
          .then((menu) => res(parseItems(fbPageId, menu)) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'LOCATION':
        return Company.findLocation(fbPageId)
          // a text response must be returned in the 'text' field of an object
          .then(data => res({ text: data.location }) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'DETAILS':
        return Type.getTypes(parsedPayload[2])
          .then(types => res(parseProductTypes(fbPageId, types)) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'ORDER':
        console.log("EXECUTING ORDER");
        // make sure wit.ai doesn't reuse data from a previous order!
        delete userSession.context.pickupTime;
        userSession.context.order = { typeid: parsedPayload[2], sizeid: parsedPayload[3] };
        return res({ text: "what time would you like that? (include am/pm)" });

      case 'SIZES':
        return getSizes(parsedPayload[2])
          .then(sizes => res(parseProductSizes(sizes)) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      default:
        return rej(new Error("couldn't deal with this postbackHandler input"));
    }

  });
}

function parseItems(botID, menu) {
  const template = {
    attachment: {
      type:"template",
      payload: { template_type:"generic" }
    }
  };
  template.attachment.payload.elements = menu.map(val => {
    return {
      title: val.item.toUpperCase(),
      image_url: `${tunnelURL}/static/images/${botID}/${val.itemid}.jpg`,
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

function parseProductTypes(botID, types) {
  const template = {
    attachment: {
      type:"template",
      payload: { template_type:"generic" }
    }
  };
  template.attachment.payload.elements = types.map(val => {
    return {
      title: val.type.toUpperCase(),
      image_url: `${tunnelURL}/static/images/${botID}/${val.itemid}/${val.typeid}.jpg`,
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
      title: `${val.size.toUpperCase()} - ${String(val.price)}`,
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

module.exports = postbackHandler;