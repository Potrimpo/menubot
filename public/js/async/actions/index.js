export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
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

export const requestPosts = () => ({
  type: REQUEST_POSTS,
});

export const setVisibilityFilter = (filter) => ({
  type: 'SET_VISIBILITY_FILTER',
  filter
});

export const toggleOrder = (orderid) => ({
  type: TOGGLE_ORDER,
  orderid
});

export const receivePosts = json => ({
  type: RECEIVE_POSTS,
  orders: json.filter(order => {
    console.log("order =", order);
    const currentDate = new Date(Date.now());
    const pickupTime = new Date(order.pickuptime);
    return pickupTime.getDate() === currentDate.getDate();
  }),
});

export const fetchPosts = fbid => {
  return dispatch => {
    dispatch(requestPosts());
    return fetch(`/api/orders/${fbid}`, { credentials : 'same-origin' })
      .then(response => response.json())
      .then(json => {
        const x = receivePosts(json);
        console.log("receivePosts =", x);
        return dispatch(x);
      })
      .catch(e => console.error("something went wrong fetching the data:", e));
  }
};
