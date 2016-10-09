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
  posts: json,
  receivedAt: Date.now()
});

const thunkFetch = dispatch => {
  dispatch(requestPosts());
  return fetch(`https://www.reddit.com/r/overwatch.json`)
    .then(response => {
      console.log("response =", response);
      return response.json()
    })
    .then(json => dispatch(receivePosts(json)))
    .catch(e => console.error("something went wrong fetching the data"));
};

export const fetchPosts = () => thunkFetch(dispatch);
