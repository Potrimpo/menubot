import socket from '../containers/socket'

export const RECEIVE_ORDERS = 'RECEIVE_ORDERS';
export const NEW_ORDER = 'NEW_ORDER';
export const TOGGLE_ORDER = 'TOGGLE_ORDER';

export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
});

const toggleLocal = ids => ({
  type: TOGGLE_ORDER,
  ids
});

export const initOrders = orders => {
  return {
    type: RECEIVE_ORDERS,
    orders
  };
};

export const newOrder = order => ({
  type: NEW_ORDER,
  order
});

const matchUserAndTime = (x, order) =>
x.pickuptime == order.pickuptime && x.customer_id == order.customer_id;

export const toggleOrder = (fbid, orders, order) => {
  return dispatch => {
    const ids = orders
      .filter(o => matchUserAndTime(o, order))
      .map(o => o.orderid);

    dispatch(toggleLocal(ids));

    return socket.emit('order-status', JSON.stringify(ids));
  };
};
