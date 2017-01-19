const { Company, Item, Order } = require('../database/models/index');

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

module.exports = {
  deleteMenu,
  deleteOrders,
  setClosed,
  clearLocation
};