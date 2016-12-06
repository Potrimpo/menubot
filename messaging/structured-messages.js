/**
 * Created by lewis.knoxstreader on 2/12/16.
 */

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
  return {
    text: "Welcome! Would you like to see our menu?",
    quick_replies: [{
      content_type: "text",
      title: "Menu",
      payload: JSON.stringify({ intent: "MENU" })
    }, {
      content_type: "text",
      title: "Location",
      payload: JSON.stringify({ intent: "LOCATION" })
    }, {
      content_type: "text",
      title: "Hours",
      payload: JSON.stringify({ intent: "HOURS" })
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

module.exports = {
  getStarted,
  parseItems,
  parseProductTypes,
  parseProductSizes,
  parseOrders
};
