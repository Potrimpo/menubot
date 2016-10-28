/**
 * Created by lewis.knoxstreader on 31/08/16.
 */

const actions = require('./actions'),
  db = require('./../repositories/bot/botQueries');

function postbackHandler (payload, userSession) {
  return new Promise(function (res, rej) {
    console.log("PAYLOAD", payload);
    payload = JSON.parse(payload);
    const { fbPageId, fbUserId } = userSession;

    switch (payload.intent) {
      case 'MENU':
        return db.getMenu(fbPageId)
          .then((menu) => res(parseItems(menu)) )
          .catch(err => console.error(`Error in postback:`, err));

      case 'LOCATION':
        return db.findLocation(fbPageId)
          // a text response must be returned in the 'text' field of an object
          .then(data => res({ text: data.location }) )
          .catch(err => console.error(`Error in postback:`, err));

      case 'DETAILS':
        return db.getTypes(payload.itemid)
          .then(types => res(parseProductTypes(types)) )
          .catch(err => console.error(`Error in postback:`, err));

      case 'SIZES':
        return db.getSizes(payload.typeid)
          .then(sizes => res(parseProductSizes(sizes)) )
          .catch(err => console.error(`Error in postback:`, err));

      case 'ORDER':
        console.log("EXECUTING ORDER");
        // make sure wit.ai doesn't reuse data from a previous order!
        delete userSession.context.pickupTime;
        // wit.ai resets the context after sending, so we cant store this data there
        userSession.order = payload;
        console.log("IN POSTBACK HANDLER", userSession);
        return res({ text: "what time would you like that? (include am/pm)" });

      case 'MY_ORDERS':
        console.log("--> looking at my orders <--");
        return db.ordersbyUserid(fbUserId)
          .then(orders => res(parseOrders(orders)))
          .catch(err => console.error(`Error in postback`, err));

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
    const details = {
      intent: 'DETAILS',
      itemid: val.itemid
    };
    const items = {
      title: `${val.item.toUpperCase()}`,
      image_url: val.photo,
      buttons: [
        {
          type: 'postback',
          title: 'Details',
          payload: JSON.stringify(details)
        }
      ]
    };
    if (val.item_price) {
      const order = {
        intent: 'ORDER',
        itemid: val.itemid
      };
      items.title = items.title.concat(` - $${val.item_price}`);
      items.buttons.push({ type: 'postback', title: 'Order', payload: JSON.stringify(order) });
    }
    return items;
  });
  return template;
}

function parseProductTypes(types) {
  const template = genericTemplate();
  template.attachment.payload.elements = types.map(val => {
    const sizes = {
      intent: 'SIZES',
      typeid: val.typeid
    };
    const types = {
      title: val.type.toUpperCase(),
      image_url: val.photo,
      buttons: [
        {
          type: 'postback',
          title: 'Sizes',
          payload: JSON.stringify(sizes)
        },
      ]
    };
    if (val.type_price) {
      const order = {
        intent: 'ORDER',
        typeid: val.typeid
      };
      types.title = types.title.concat(` - $${val.type_price}`);
      types.buttons.push({ type: 'postback', title: 'Order', payload: JSON.stringify(order) });
    }
    console.log("     -----> types.title =", types.title);
    return types;
  });
  return template;
}

function parseProductSizes(sizes) {
  const template = genericTemplate();
  template.attachment.payload.elements = sizes.map(val => {
    const order = {
      intent: 'ORDER',
      sizeid: val.sizeid
    };
    return {
      title: `${val.size.toUpperCase()}`,
      buttons: [
        {
          type: 'postback',
          title: 'Order',
          payload: JSON.stringify(order)
        },
      ]
    };
  });
  return template;
}

function parseOrders(orders) {
  const template = genericTemplate();
  template.attachment.payload.elements = orders.map(val => {
    console.log("val -=", val);
    if (val.size) {
      return {
        title: `${val.size.toUpperCase()} ${val.type.toUpperCase()} ${val.item.toUpperCase()}`,
        subtitle: `$${val.size_price}`
      };
    } else if (val.type) {
      return {
        title: `${val.type.toUpperCase()} ${val.item.toUpperCase()}`,
        subtitle: `$${val.type_price}`
      }
    } else {
      return {
        title: `${val.item.toUpperCase()}`,
        subtitle: `$${val.item_price}`
      }
    }
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