/**
 * Created by lewis.knoxstreader on 31/08/16.
 */

const actions = require('../actions');

function persistentMenu (payload, botID) {
  let response = {};
  return new Promise(function (res, rej) {
    switch (payload) {

      case 'MENU':
        return actions.bizMenu(botID)
          .then((menu) => {
            response = parseMenu(menu);
            console.log('response from parseMenu', response);
            return res(response);
          });

      case 'LOCATION':
        return actions.bizLocation(botID)
          .then(data => {
            response.text = data;
            return res(response);
          });
      //
      // case: 'DETAILS':
      //   return actions

      default:
        return rej(new Error("couldn't deal with this persistent-menu input"));
    }
  });
}

function parseMenu(menu) {
  console.log('MenuItem in parseMenu', menu);
  const template = {
    attachment: {
      type:"template",
      payload:{
        template_type:"generic",
      }
    }
  };
  template.attachment.payload.elements = menu.map(val => {
    return {
      title: val.name.toUpperCase(),
      buttons: [
        {
          type: 'postback',
          title: 'Order',
          payload: 'ORDER'
        },
        {
          type: 'postback',
          title: 'Details',
          payload: 'DETAILS'
        }
      ]
    };
  });
  return template;
}

module.exports = persistentMenu;