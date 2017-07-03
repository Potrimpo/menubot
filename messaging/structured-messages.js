const QR = require('./quick-replies'),
  txt = require('./message-list'),
  moment = require('moment-timezone');

const getStarted = () => ({
  text: txt.welcome,
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
      subtitle: val.item_description,
      image_url: val.item_photo,
    };

    if (val.item_price) {
      items.title = items.title.concat(` - $${val.item_price}`);
      items.buttons = [
        button({ intent: 'Order', itemid: val.itemid, price: val.item_price })
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
      subtitle: val.type_description,
      image_url: val.type_photo,
    };

    if (val.type_price) {
      types.title = types.title.concat(` - $${val.type_price}`);
      types.buttons = [
        button({ intent: 'Order', itemid, typeid: val.typeid, price: val.type_price })
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
      sizeid: val.sizeid,
      price: val.size_price
    };

    return {
      title: `${val.size.toUpperCase()} - $${val.size_price}`,
      subtitle: val.size_description,
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
        title: `${val.quantity}x ${val.size.toUpperCase()} ${val.type.toUpperCase()} ${val.item.toUpperCase()}`,
        subtitle: `$${val.quantity * val.size_price} @ ${readableTime}`
      };
    } else if (val.type) {
      return {
        title: `${val.quantity}x ${val.type.toUpperCase()} ${val.item.toUpperCase()}`,
        subtitle: `$${val.quantity * val.type_price} @ ${readableTime}`
      }
    } else {
      return {
        title: `${val.quantity}x ${val.item.toUpperCase()}`,
        subtitle: `$${val.quantity * val.item_price} @ ${readableTime}`
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
