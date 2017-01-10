/**
 * Created by lewis.knoxstreader on 2/12/16.
 */

const QR = require('./quick-replies'),
  moment = require('moment-timezone');

const getStarted = () => ({
  text: "Welcome! Would you like to see our menu?",
  quick_replies: QR.basicReplies
});

const genericTemplate  = () => ({
  attachment: {
    type:"template",
    payload: { template_type:"generic" }
  }
});

const button = payload => ({
  type: 'postback',
  title: payload.intent,
  payload: JSON.stringify(payload)
});

function items(menu) {
  const template = genericTemplate();

  template.attachment.payload.elements = menu.map(val => {
    const items = {
      title: `${val.item.toUpperCase()}`,
      image_url: val.item_photo,
    };

    if (val.item_price) {
      items.title = items.title.concat(` - $${val.item_price}`);
      items.buttons = [
        button({ intent: 'Order', itemid: val.itemid })
      ];
      return items;
    }

    else {
      items.buttons = [
        button({ intent: 'Details', itemid: val.itemid })
      ];
      return items;
    }
  });

  return template;
}

function types(types, itemid) {
  const template = genericTemplate();

  template.attachment.payload.elements = types.map(val => {
    const types = {
      title: val.type.toUpperCase(),
      image_url: val.type_photo,
    };

    if (val.type_price) {
      types.title = types.title.concat(` - $${val.type_price}`);
      types.buttons = [
        button({ intent: 'Order', itemid, typeid: val.typeid })
      ];
      return types;
    }

    else {
      types.buttons = [
        button({ intent: 'Sizes', itemid, typeid: val.typeid })
      ];
      return types;
    }

  });

  return template;
}

function sizes(sizes, typeid, itemid) {
  const template = genericTemplate();
  template.attachment.payload.elements = sizes.map(val => {
    const order = {
      intent: 'Order',
      itemid,
      typeid,
      sizeid: val.sizeid
    };

    return {
      title: `${val.size.toUpperCase()} - $${val.size_price}`,
      buttons: [
        button(order)
      ]
    };
  });

  return template;
}

function orders(orders) {
  const template = genericTemplate();
  template.attachment.payload.elements = orders.map(val => {
    var readableTime = moment.tz(val.pickuptime, val.timezone).format('h:mma, dddd z');

    if (val.size) {
      return {
        title: `${val.size.toUpperCase()} ${val.type.toUpperCase()} ${val.item.toUpperCase()}`,
        subtitle: `$${val.size_price} @ ${readableTime}`
      };
    } else if (val.type) {
      return {
        title: `${val.type.toUpperCase()} ${val.item.toUpperCase()}`,
        subtitle: `$${val.type_price} @ ${readableTime}`
      }
    } else {
      return {
        title: `${val.item.toUpperCase()}`,
        subtitle: `$${val.item_price} @ ${readableTime}`
      }
    }
  });
  template.quick_replies = QR.basicReplies;

  return template;
}

module.exports = {
  getStarted,
  items,
  types,
  sizes,
  orders
};
