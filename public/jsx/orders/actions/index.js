export const REQUEST_ORDERS = 'REQUEST_ORDERS';
export const RECEIVE_ORDERS = 'RECEIVE_ORDERS';
export const RELOAD = 'RELOAD';
export const TOGGLE_ORDER = 'TOGGLE_ORDER';

export const reload = () => ({
  type: RELOAD,
});

export const requestOrders = () => ({
  type: REQUEST_ORDERS,
});

export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
});

const toggleLocal = (orderid) => ({
  type: TOGGLE_ORDER,
  orderid
});

export const receiveAndParse = json => {
  console.log("returned orders =", json);
  return {
    type: RECEIVE_ORDERS,
  orders: json
    .map(order => {
      return {
        ...order,
        pickuptime: timeParsing(order.pickuptime)
      };
    })
  };
};

export const fetchOrders = fbid => {
  return dispatch => {
    dispatch(requestOrders());
    return fetch(`/api/orders/${fbid}`, { credentials : 'same-origin' })
      .then(response => response.json())
      .then(json => dispatch(receiveAndParse(json)))
      .catch(e => console.error("something went wrong fetching the data:", e));
  }
};

export const toggleOrder = (fbid, orderid) => {
  return dispatch => {
    console.log("orderid =", orderid);
    console.log("fbid =", fbid);
    dispatch(toggleLocal(orderid));
    let data = {
      orderid
    };
    return $.ajax({
      type: 'POST',
      url: `/api/orders/${fbid}`,
      data,
      encode: true,
      success(data) {
        console.log("SUCCESS");
        console.log(data);
      },
      error(smth, status, err) {
        console.error("ERROR IN AJAX", status);
        console.error("ERROR =", err);
      }
    })
      .done(function(data) {
        console.log("DONE", data);
      });

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
