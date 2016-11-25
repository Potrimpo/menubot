import socket from '../containers/socket'

export const RECEIVE_ORDERS = 'RECEIVE_ORDERS';
export const NEW_ORDERS = 'NEW_ORDERS';
export const TOGGLE_ORDER = 'TOGGLE_ORDER';

export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
});

const toggleLocal = (orderid) => ({
  type: TOGGLE_ORDER,
  orderid
});

export const initOrders = json => {
  return {
    type: RECEIVE_ORDERS,
    orders: json.map(order => ({
      ...order,
      pickuptime: timeParsing(order.pickuptime)
    }))
  };
};

export const newOrder = json => {
  return {
    type: NEW_ORDERS,
    orders: json.map(order => ({
      ...order,
      pickuptime: timeParsing(order.pickuptime)
    }))
  };
};

export const toggleOrder = (fbid, orderid) => {
  return dispatch => {
    dispatch(toggleLocal(orderid));

    return socket.emit('order-status', orderid);
  };
};

function timeParsing (pickuptime) {
  const ordertime = new Date(pickuptime);
  let hours = ordertime.getHours(),
    minutes = ordertime.getMinutes();

  hours = hours > 10 ? hours : `0${hours}`;
  minutes = minutes > 10 ? minutes : `0${minutes}`;

  return `${hours}: ${minutes}`;
}
