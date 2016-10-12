import { combineReducers } from 'redux'
import { RELOAD, REQUEST_POSTS, RECEIVE_POSTS, REQUEST_FBID, TOGGLE_ORDER } from '../actions'
import filter from './filter'

const order = (state, action) => {
  switch (action.type) {
    case TOGGLE_ORDER:
      if (state.orderid !== action.orderid) {
        return state
      }

      return {
        ...state,
        pending: !state.pending
      };
    default:
      return state
  }
};

const orders = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
      return [ ...action.orders ];
    case TOGGLE_ORDER:
      return state.map(o => order(o, action));
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
        isFetching: true,
        forceReload: true
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
  fbid,
  orders,
  status,
  filter
});

export default rootReducer
