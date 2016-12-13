import { combineReducers } from 'redux'
import { RECEIVE_ORDERS, TOGGLE_ORDER, NEW_ORDER } from '../actions'
import filter from './filter'
import delay from './delay'

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
      return orderPlacement(state, action.order);
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
  let newState;
  for (let i = 0; i < state.length; i++) {
    if (new Date(newOrder.pickuptime) < new Date(state[i].pickuptime)) {
      newState = state.slice(0, i);
      newState.push(newOrder);
      newState.push(...state.slice(i));
      return newState;
    }
  }
  newState = state.slice(0);
  newState.push(newOrder);
  return newState;
}
