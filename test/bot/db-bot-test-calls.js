const { Company, Item, Order } = require('../../database/models/index');

const deleteMenu = fbid =>
  Item.destroy({
    where: { fbid }
  });

const deleteOrders = fbid =>
  Order.destroy({
    where: { fbid }
  });

const setClosed = fbid =>
  Company.update(
    { status: false },
    { where: { fbid } });

const clearLocation = fbid =>
  Company.update(
    { location: '' },
    { where: { fbid } });

const setLocation = fbid =>
  Company.update(
    { location: '123 Fake Street' },
    { where: { fbid } });

const insertItem = (fbid, name, price) =>
  Item.create({
    fbid,
    item: name,
    item_price: price
  });

const createOrder = (fbid, userId, time, itemid) =>
  Order.create({
    fbid,
    customer_id: userId,
    pickuptime: time,
    itemid
  });

const setOpen = fbid =>
  Company.update(
    {
      status: true,
      opentime: '9am',
      closetime: '5pm'
    },
    { where: { fbid } });

module.exports = {
  deleteMenu,
  insertItem,
  deleteOrders,
  createOrder,
  setClosed,
  setOpen,
  clearLocation,
  setLocation
};