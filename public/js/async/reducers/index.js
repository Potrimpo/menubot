import { combineReducers } from 'redux'
import { RELOAD, REQUEST_POSTS, RECEIVE_POSTS, REQUEST_FBID } from '../actions'

const orders = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return [ ...action.posts ];
    default:
      return state
  }
};

const status = (state = {
  isFetching: false,
  forceReload: false,
}, action) => {
  switch (action.type) {
    case RELOAD:
      return {
        ...state,
        forceReload: true,
        isFetching: true
      };
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        forceReload: false
      };
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        forceReload: false,
      };
    default:
      return state
  }
};

const fbid = (state = "", action) => {
  switch(action.type) {
    case REQUEST_FBID:
      return action.fbid || "";
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  orders,
  status,
  fbid
});

export default rootReducer
