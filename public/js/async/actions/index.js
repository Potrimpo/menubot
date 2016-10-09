export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const RELOAD = 'RELOAD';

export const reload = () => ({
  type: RELOAD,
});

export const requestPosts = () => ({
  type: REQUEST_POSTS,
});

export const receivePosts = json => ({
  type: RECEIVE_POSTS,
  posts: json.filter(order => {
    const currentDate = new Date(Date.now());
    const pickupTime = new Date(order.pickuptime);
    return pickupTime.getDate() === currentDate.getDate();
  }),
});

export const fetchPosts = () => {
  return dispatch => {
    return fetch("/api/orders/1766837970261548", { credentials : 'same-origin' })
      .then(response => response.json())
      .then(json => {
        console.log("parsed json", json);
        return dispatch(receivePosts(json))
      })
      .catch(e => console.error("something went wrong fetching the data"));
  }
};
