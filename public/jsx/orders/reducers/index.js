import { combineReducers } from 'redux'
import { RECEIVE_ORDERS, TOGGLE_ORDER, NEW_ORDER } from '../actions'
import filter from './filter'

const bongNoise = new Audio('/audio/bong.mp3');

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
    case NEW_ORDER:
      bongNoise.play();
      return [ ...state, action.order ];
    case TOGGLE_ORDER:
      return state.map(o => order(o, action));
    default:
      return state
  }
};

const fbid = (state = "", action) => state;

const rootReducer = combineReducers({
  fbid,
  orders,
  filter
});

export default rootReducer
