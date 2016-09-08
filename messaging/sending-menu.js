/**
 * Created by lewis.knoxstreader on 31/08/16.
 */

const actions = require('./actions'),
  { findItem, getMenu, getTypes, getLocation } = require('../sql');

function postbackHandler (payload, botID) {
  return new Promise(function (res, rej) {
    const parsedPayload = /([A-Z]+)!?(\w*)/g.exec(payload);
    switch (parsedPayload[1]) {

      case 'MENU':
        return getMenu(botID)
          .then((menu) => res(parseItems(menu)) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'LOCATION':
        return getLocation(botID)
          // a text response must be returned in the 'text' field of an object
          .then(data => res({ text: data.location }) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'DETAILS':
        return getTypes(parsedPayload[2])
          .then(types => res(parseProductTypes(types)) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

      case 'ORDER':
        return getTypes(botID, parsedPayload[2])
          .then(types => res(parseProductTypes(types)) )
          .catch(err => console.error(`Error in ${parsedPayload[1]} postback:`, err.message || err));

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
      buttons: [
        // {
        //   type: 'postback',
        //   title: 'Order',
        //   payload: `ORDER!${val.itemid}`
        // },
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

function parseProductTypes(ITEMIDs) {
  const template = {
    attachment: {
      type:"template",
      payload: { template_type:"generic" }
    }
  };
  template.attachment.payload.elements = ITEMIDs.map(val => {
    return {
      title: val.type.toUpperCase(),
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

module.exports = postbackHandler;