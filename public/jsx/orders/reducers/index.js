import { combineReducers } from 'redux'
import { REQUEST_ORDERS, RECEIVE_ORDERS, TOGGLE_ORDER, NEW_ORDERS } from '../actions'
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
    case RECEIVE_ORDERS:
      return [ ...action.orders ];
    case NEW_ORDERS:
      return [ ...state, ...action.orders ];
    case TOGGLE_ORDER:
      return state.map(o => order(o, action));
    default:
      return state
  }
};

const status = (state = { isFetching: false }, action) => {
  switch (action.type) {
    case REQUEST_ORDERS:
      return {
        ...state,
        isFetching: true
      };
    case RECEIVE_ORDERS:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state
  }
};

const fbid = (state = "", action) => state;

const rootReducer = combineReducers({
  fbid,
  orders,
  status,
  filter
});

export default rootReducer
