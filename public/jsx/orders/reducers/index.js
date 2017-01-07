import { combineReducers } from 'redux'
import { RECEIVE_ORDERS, TOGGLE_ORDER, NEW_ORDER } from '../actions'
import filter from './filter'
import delay from './delay'
import { findNewOrderLocation } from '../misc-functions'

const bongNoise = new Audio('/audio/bong.mp3');

const order = (state, action) => {
  switch (action.type) {
    case TOGGLE_ORDER:
      if (action.ids.includes(state.orderid)) {
        return {
          ...state,
          pending: !state.pending
        }
      } else {
        return state
      }

    default:
      return state
  }
};

const orders = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_ORDERS:
      return [ ...action.orders ];
    case NEW_ORDER:
      const newOrderPlacement = orderPlacement(state, action.order);
      bongNoise.play();
      return newOrderPlacement
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
  filter,
  delay
});

export default rootReducer

function orderPlacement (state, newOrder) {
  return findNewOrderLocation(state, newOrder)
  return state
}
