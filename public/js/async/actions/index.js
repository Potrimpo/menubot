export const REQUEST_ORDERS = 'REQUEST_ORDERS';
export const RECEIVE_ORDERS = 'RECEIVE_ORDERS';
export const RELOAD = 'RELOAD';
export const REQUEST_FBID = 'REQUEST_FBID';
export const TOGGLE_ORDER = 'TOGGLE_ORDER';

export const reload = () => ({
  type: RELOAD,
});

export const requestFbid = () => {
  return {
    type: REQUEST_FBID,
    fbid: document.getElementById("root").getAttribute("name")
  };
};

export const requestOrders = () => ({
  type: REQUEST_ORDERS,
});

export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
});

export const toggleOrder = (orderid) => ({
  type: TOGGLE_ORDER,
  orderid
});

export const todaysOrders = json => ({
  type: RECEIVE_ORDERS,
  orders: json.filter(order => {
    const currentDate = new Date(Date.now());
    const pickupTime = new Date(order.pickuptime);
    return pickupTime.getDate() === currentDate.getDate();
  }),
});

export const fetchOrders = fbid => {
  return dispatch => {
    dispatch(requestOrders());
    return fetch(`/api/orders/${fbid}`, { credentials : 'same-origin' })
      .then(response => response.json())
      .then(json => {
        return dispatch(todaysOrders(json));
      })
      .catch(e => console.error("something went wrong fetching the data:", e));
  }
};
