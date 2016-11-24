/**
 * Created by lewis.knoxstreader on 31/08/16.
 */

const { redisRecordOrder } = require('./messengerSessions'),
  db = require('./../repositories/bot/botQueries');

function postbackHandler (payload, fbUserId, fbPageId) {
  return new Promise(function (res, rej) {
    payload = JSON.parse(payload);

    switch (payload.intent) {
      case 'MENU':
        return db.getMenu(fbPageId)
          .then((menu) => res(parseItems(menu)) )
          .catch(err => console.error(`Error in postback:`, err));

      case 'LOCATION':
        return db.findLocation(fbPageId)
          .then(data => res({ text: data.location ? data.location : "Sorry, I don't know where I am!" }))
          .catch(err => console.error(`Error in postback:`, err));

      case 'DETAILS':
        return db.getTypes(payload.itemid)
          .then(types => res(parseProductTypes(types, payload.itemid)) )
          .catch(err => console.error(`Error in postback:`, err));

      case 'SIZES':
        return db.getSizes(payload.typeid)
          .then(sizes => res(parseProductSizes(sizes, payload.typeid, payload.itemid)) )
          .catch(err => console.error(`Error in postback:`, err));

      case 'ORDER':
        return redisRecordOrder(fbUserId, payload)
          .then(() => {
            return res({ text: "what time would you like that? (include am/pm)" });
          });

      case 'MY_ORDERS':
        return db.ordersbyUserid(fbUserId)
          .then(orders => res(parseOrders(orders)))
          .catch(err => console.error(`Error in postback`, err));

      case 'GET_STARTED':
       return res(getStarted());

      default:
        return rej(new Error("couldn't deal with this postbackHandler input"));
    }

  });
}

function parseItems(menu) {
  const template = genericTemplate();
  template.attachment.payload.elements = menu.map(val => {
    const items = {
      title: `${val.item.toUpperCase()}`,
      image_url: val.item_photo,
      buttons: []
    };
    if (val.item_price) {
      const order = {
        intent: 'ORDER',
        itemid: val.itemid
      };
      items.title = items.title.concat(` - $${val.item_price}`);
      items.buttons.push({ type: 'postback', title: 'Order', payload: JSON.stringify(order) });
      return items;
    }
    const details = {
      intent: 'DETAILS',
      itemid: val.itemid
    };
    items.buttons.push({ type: 'postback', title: 'Details', payload: JSON.stringify(details) });
    return items;
  });
  return template;
}

function parseProductTypes(types, itemid) {
  const template = genericTemplate();
  template.attachment.payload.elements = types.map(val => {
    const types = {
      title: val.type.toUpperCase(),
      image_url: val.type_photo,
      buttons: []
    };
    if (val.type_price) {
      const order = {
        intent: 'ORDER',
        itemid,
        typeid: val.typeid
      };
      types.title = types.title.concat(` - $${val.type_price}`);
      types.buttons.push({ type: 'postback', title: 'Order', payload: JSON.stringify(order) });
      return types;
    }
    const sizes = {
      intent: 'SIZES',
      itemid,
      typeid: val.typeid
    };
    types.buttons.push({ type: 'postback', title: 'Sizes', payload: JSON.stringify(sizes) });
    return types;
  });
  return template;
}

function parseProductSizes(sizes, typeid, itemid) {
  const template = genericTemplate();
  template.attachment.payload.elements = sizes.map(val => {
    const order = {
      intent: 'ORDER',
      itemid,
      typeid,
      sizeid: val.sizeid
    };
    return {
      title: `${val.size.toUpperCase()} - $${val.size_price}`,
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
    if (val.size) {
      return {
        title: `${val.size.toUpperCase()} ${val.type.toUpperCase()} ${val.item.toUpperCase()}`,
        subtitle: `$${val.size_price} @ ${val.pickuptime}`
      };
    } else if (val.type) {
      return {
        title: `${val.type.toUpperCase()} ${val.item.toUpperCase()}`,
        subtitle: `$${val.type_price} @ ${val.pickuptime}`
      }
    } else {
      return {
        title: `${val.item.toUpperCase()}`,
        subtitle: `$${val.item_price} @ ${val.pickuptime}`
      }
    }
  });
  return template;
}

function getStarted () {
  const payload = { intent: "MENU" };
  return {
    text: "Welcome to the menu.bot experience",
    quick_replies: [{
      content_type: "text",
      title: "Menu",
      payload: JSON.stringify(payload)
    }]
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
