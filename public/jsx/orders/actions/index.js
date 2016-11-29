import socket from '../containers/socket'

export const RECEIVE_ORDERS = 'RECEIVE_ORDERS';
export const NEW_ORDER = 'NEW_ORDER';
export const TOGGLE_ORDER = 'TOGGLE_ORDER';

export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
});

const toggleLocal = (orderid) => ({
  type: TOGGLE_ORDER,
  orderid
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

export const toggleOrder = (fbid, orderid) => {
  return dispatch => {
    dispatch(toggleLocal(orderid));

    return socket.emit('order-status', orderid);
  };
};
