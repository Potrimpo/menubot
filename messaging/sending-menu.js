/**
 * Created by lewis.knoxstreader on 31/08/16.
 */

const actions = require('./actions'),
  { getMenu, getLocation } = require('../sql');

function postbackHandler (payload, botID) {
  // a text response must be returned in the 'text' field of an object
  let response = {};
  return new Promise(function (res, rej) {
    const parsedPayload = /([A-Z]+)!?(\w*)/g.exec(payload);
    switch (parsedPayload[1]) {

      case 'MENU':
        return getMenu(botID)
          .then((menu) => res(parseMenu(menu)) );

      case 'LOCATION':
        return getLocation(botID)
          .then(data => {
            response.text = data.location;
            return res(response);
          });

      case 'DETAILS':
        return actions.bizProduct(botID, parsedPayload[2])
          .then(items => res(parseItems(items)) );

      case 'ORDER':
        return actions.bizProduct(botID, parsedPayload[2])
          .then(items => res(parseItems(items)) );

      default:
        return rej(new Error("couldn't deal with this postbackHandler input"));
    }
  });
}

function parseMenu(menu) {
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
        {
          type: 'postback',
          title: 'Order',
          payload: `ORDER!${val.item}`
        },
        {
          type: 'postback',
          title: 'Details',
          payload: `DETAILS!${val.item}`
        }
      ]
    };
  });
  return template;
}

function parseItems(items) {
  const template = {
    attachment: {
      type:"template",
      payload: { template_type:"generic" }
    }
  };
  template.attachment.payload.elements = items[0].types.map(val => {
    return {
      title: val.name.toUpperCase(),
      buttons: [
        {
          type: 'postback',
          title: 'Order',
          payload: `ORDER!${val.name}`
        },
        {
          type: 'postback',
          title: 'Sizes',
          payload: `SIZES!${val.name}`
        },
      ]
    };
  });
  return template;
}

module.exports = postbackHandler;